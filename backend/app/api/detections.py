"""Seagrass detection and computer vision inference endpoints.

Accepts quadrat image uploads, runs species classification & morphometrics
extraction, and couples hydrodynamic wave attenuation modeling.
"""

from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.seagrass import Species
from app.models.survey import Survey, SurveyImage
from app.services.storage import StorageService, get_storage
from app.services.yolo_service import YOLOService, get_yolo_service

router = APIRouter()


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(..., description="Seagrass quadrat photo (JPEG/PNG)"),
    water_depth_m: float = Query(1.5, ge=0.1, le=25.0, description="Local water depth in meters"),
    incident_wave_height_m: float = Query(0.8, ge=0.05, le=5.0, description="Incident wave height (H0) in meters"),
    wave_period_s: float = Query(4.5, ge=1.0, le=20.0, description="Peak wave period (T) in seconds"),
    meadow_width_m: float = Query(50.0, ge=5.0, le=1000.0, description="Meadow cross-shore width in meters"),
    survey_id: uuid.UUID | None = Query(None, description="Optional Survey ID to attach image"),
    db: AsyncSession = Depends(get_db),
    yolo: YOLOService = Depends(get_yolo_service),
    storage: StorageService = Depends(get_storage),
) -> dict[str, Any]:
    """Analyze a seagrass quadrat photo.

    Extracts:
    1. Primary species & classification confidence
    2. Seagrass meadow coverage percentage
    3. Blade length (cm) and shoot density (shoots/m²)
    4. Bounding boxes identifying seagrass clusters
    5. Mendez & Losada (2004) wave damping impact (% energy dissipation & height reduction)
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image (JPEG, PNG, WebP).",
        )

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # Run inference / heuristic analysis
    analysis_result = await yolo.detect(
        image_bytes=image_bytes,
        filename=file.filename or "quadrat.jpg",
        water_depth_m=water_depth_m,
        incident_wave_height_m=incident_wave_height_m,
        wave_period_s=wave_period_s,
        meadow_width_m=meadow_width_m,
    )

    # If associated with a survey, upload to Supabase Storage and register image
    image_record_id = None
    image_url = None
    if survey_id is not None:
        survey_res = await db.execute(select(Survey).where(Survey.id == survey_id))
        survey = survey_res.scalar_one_or_none()
        if survey is not None:
            filename = file.filename or f"quadrat_{uuid.uuid4().hex[:8]}.jpg"
            storage_key = f"surveys/{survey_id}/{uuid.uuid4()}_{filename}"
            uploaded_key = await storage.upload_image(
                key=storage_key,
                data=image_bytes,
                content_type=file.content_type,
            )
            image_url = storage.get_public_url(uploaded_key)

            img_record = SurveyImage(
                survey_id=survey_id,
                filename=filename,
                s3_key=uploaded_key,
                content_type=file.content_type,
            )
            db.add(img_record)
            await db.flush()
            image_record_id = str(img_record.id)

    analysis_result["image_id"] = image_record_id
    analysis_result["image_url"] = image_url
    return analysis_result


from app.services.cache import response_cache

@router.get("/species")
async def list_species(
    db: AsyncSession = Depends(get_db),
) -> list[dict[str, Any]]:
    """List known seagrass species reference catalogue."""
    cached = response_cache.get("species:all")
    if cached is not None:
        return cached

    result = await db.execute(select(Species).order_by(Species.scientific_name))
    species_list = result.scalars().all()
    data = [
        {
            "id": str(s.id),
            "scientific_name": s.scientific_name,
            "common_name": s.common_name,
            "description": s.description,
        }
        for s in species_list
    ]
    response_cache.set("species:all", data, ttl=3600)
    return data
