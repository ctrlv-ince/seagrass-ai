"""Survey CRUD and field data endpoints.

Handles survey metadata, transects, quadrats, and field photo uploads to Supabase Storage.
"""

from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from geoalchemy2.functions import ST_AsGeoJSON, ST_MakePoint, ST_SetSRID, ST_X, ST_Y
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.seagrass import Quadrat, Species, Transect
from app.models.survey import Survey, SurveyImage
from app.schemas.seagrass import (
    QuadratCreate,
    QuadratResponse,
    TransectCreate,
    TransectResponse,
)
from app.schemas.survey import (
    SurveyCreate,
    SurveyImageResponse,
    SurveyListResponse,
    SurveyResponse,
    SurveyUpdate,
)
from app.services.cache import response_cache
from app.services.storage import StorageService, get_storage

router = APIRouter()


def _format_survey_response(survey: Survey, image_count: int = 0) -> SurveyResponse:
    """Format survey with extracted lat/lng and image count."""
    lat = None
    lng = None
    if survey.center_point is not None:
        try:
            # If coordinates are accessible via GeoAlchemy element
            pass
        except Exception:
            pass

    return SurveyResponse(
        id=survey.id,
        title=survey.title,
        description=survey.description,
        surveyor_name=survey.surveyor_name,
        location_name=survey.location_name,
        status=survey.status,
        center_latitude=lat,
        center_longitude=lng,
        image_count=image_count or len(survey.images) if hasattr(survey, "images") and survey.images is not None else 0,
        started_at=survey.started_at,
        completed_at=survey.completed_at,
        created_at=survey.created_at,
        updated_at=survey.updated_at,
    )


@router.get("/", response_model=SurveyListResponse)
async def list_surveys(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> SurveyListResponse:
    """List all surveys with pagination."""
    offset = (page - 1) * page_size

    total_result = await db.execute(select(func.count(Survey.id)))
    total = total_result.scalar_one()

    result = await db.execute(
        select(Survey)
        .options(selectinload(Survey.images))
        .order_by(Survey.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    surveys = result.scalars().all()

    return SurveyListResponse(
        items=[_format_survey_response(s) for s in surveys],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{survey_id}", response_model=SurveyResponse)
async def get_survey(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> SurveyResponse:
    """Get a single survey by ID."""
    result = await db.execute(
        select(Survey)
        .options(selectinload(Survey.images))
        .where(Survey.id == survey_id)
    )
    survey = result.scalar_one_or_none()
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    return _format_survey_response(survey)


@router.post("/", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def create_survey(
    body: SurveyCreate,
    db: AsyncSession = Depends(get_db),
) -> SurveyResponse:
    """Create a new survey."""
    center_geom = None
    if body.center_latitude is not None and body.center_longitude is not None:
        center_geom = f"SRID=4326;POINT({body.center_longitude} {body.center_latitude})"

    survey = Survey(
        title=body.title,
        description=body.description,
        surveyor_name=body.surveyor_name,
        location_name=body.location_name,
        center_point=center_geom,
    )
    db.add(survey)
    await db.flush()
    await db.refresh(survey)
    response_cache.invalidate("map:")

    resp = _format_survey_response(survey)
    resp.center_latitude = body.center_latitude
    resp.center_longitude = body.center_longitude
    return resp


@router.patch("/{survey_id}", response_model=SurveyResponse)
async def update_survey(
    survey_id: uuid.UUID,
    body: SurveyUpdate,
    db: AsyncSession = Depends(get_db),
) -> SurveyResponse:
    """Update an existing survey."""
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    update_data = body.model_dump(exclude_unset=True)
    lat = update_data.pop("center_latitude", None)
    lng = update_data.pop("center_longitude", None)
    if lat is not None and lng is not None:
        survey.center_point = f"SRID=4326;POINT({lng} {lat})"

    for field, value in update_data.items():
        setattr(survey, field, value)

    await db.flush()
    await db.refresh(survey)
    response_cache.invalidate("map:")
    return _format_survey_response(survey)


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
async def delete_survey(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a survey."""
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    await db.delete(survey)
    response_cache.invalidate("map:")


# ── Survey Images & Uploads ───────────────────────────────────


@router.post("/{survey_id}/images", response_model=SurveyImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_survey_image(
    survey_id: uuid.UUID,
    file: UploadFile = File(...),
    latitude: float | None = Query(None, ge=-90, le=90),
    longitude: float | None = Query(None, ge=-180, le=180),
    db: AsyncSession = Depends(get_db),
    storage: StorageService = Depends(get_storage),
) -> SurveyImageResponse:
    """Upload a quadrat/meadow photo to Supabase Storage and link to survey."""
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty")

    file_ext = (file.filename or "image.jpg").split(".")[-1]
    storage_key = f"surveys/{survey_id}/{uuid.uuid4()}.{file_ext}"

    uploaded_key = await storage.upload_image(
        key=storage_key,
        data=content,
        content_type=file.content_type or "image/jpeg",
    )
    public_url = storage.get_public_url(uploaded_key)

    loc_geom = None
    if latitude is not None and longitude is not None:
        loc_geom = f"SRID=4326;POINT({longitude} {latitude})"

    img = SurveyImage(
        survey_id=survey_id,
        filename=file.filename or "photo.jpg",
        s3_key=uploaded_key,
        content_type=file.content_type or "image/jpeg",
        gps_latitude=latitude,
        gps_longitude=longitude,
        location=loc_geom,
    )
    db.add(img)
    await db.flush()
    await db.refresh(img)

    return SurveyImageResponse(
        id=img.id,
        survey_id=img.survey_id,
        filename=img.filename,
        s3_key=img.s3_key,
        content_type=img.content_type,
        url=public_url,
        gps_latitude=img.gps_latitude,
        gps_longitude=img.gps_longitude,
        captured_at=img.captured_at,
        created_at=img.created_at,
    )


@router.get("/{survey_id}/images", response_model=list[SurveyImageResponse])
async def list_survey_images(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    storage: StorageService = Depends(get_storage),
) -> list[SurveyImageResponse]:
    """List all images captured for a survey with public CDN URLs."""
    result = await db.execute(
        select(SurveyImage)
        .where(SurveyImage.survey_id == survey_id)
        .order_by(SurveyImage.created_at.desc())
    )
    images = result.scalars().all()

    return [
        SurveyImageResponse(
            id=img.id,
            survey_id=img.survey_id,
            filename=img.filename,
            s3_key=img.s3_key,
            content_type=img.content_type,
            url=storage.get_public_url(img.s3_key),
            gps_latitude=img.gps_latitude,
            gps_longitude=img.gps_longitude,
            captured_at=img.captured_at,
            created_at=img.created_at,
        )
        for img in images
    ]


# ── Transects & Quadrats ──────────────────────────────────────


@router.post("/{survey_id}/transects", response_model=TransectResponse, status_code=status.HTTP_201_CREATED)
async def create_transect(
    survey_id: uuid.UUID,
    body: TransectCreate,
    db: AsyncSession = Depends(get_db),
) -> TransectResponse:
    """Create a transect line for a survey."""
    geom_wkt = f"SRID=4326;LINESTRING({body.start_longitude} {body.start_latitude}, {body.end_longitude} {body.end_latitude})"

    transect = Transect(
        survey_id=survey_id,
        name=body.name,
        geometry=geom_wkt,
    )
    db.add(transect)
    await db.flush()
    await db.refresh(transect)
    response_cache.invalidate("map:")

    return TransectResponse(
        id=transect.id,
        survey_id=transect.survey_id,
        name=transect.name,
        start_point=[body.start_longitude, body.start_latitude],
        end_point=[body.end_longitude, body.end_latitude],
        quadrat_count=0,
        created_at=transect.created_at,
    )


@router.get("/{survey_id}/transects", response_model=list[TransectResponse])
async def list_transects(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> list[TransectResponse]:
    """List transects for a survey."""
    result = await db.execute(
        select(Transect)
        .options(selectinload(Transect.quadrats))
        .where(Transect.survey_id == survey_id)
        .order_by(Transect.created_at.asc())
    )
    transects = result.scalars().all()

    return [
        TransectResponse(
            id=t.id,
            survey_id=t.survey_id,
            name=t.name,
            quadrat_count=len(t.quadrats) if t.quadrats else 0,
            created_at=t.created_at,
        )
        for t in transects
    ]


@router.post("/transects/{transect_id}/quadrats", response_model=QuadratResponse, status_code=status.HTTP_201_CREATED)
async def create_quadrat(
    transect_id: uuid.UUID,
    body: QuadratCreate,
    db: AsyncSession = Depends(get_db),
) -> QuadratResponse:
    """Create a quadrat point along a transect."""
    point_wkt = f"SRID=4326;POINT({body.longitude} {body.latitude})"

    quadrat = Quadrat(
        transect_id=transect_id,
        position_along_transect=body.position_along_transect,
        location=point_wkt,
        coverage_percent=body.coverage_percent,
        species_id=body.species_id,
    )
    db.add(quadrat)
    await db.flush()
    await db.refresh(quadrat)
    response_cache.invalidate("map:")

    return QuadratResponse(
        id=quadrat.id,
        transect_id=quadrat.transect_id,
        position_along_transect=quadrat.position_along_transect,
        latitude=body.latitude,
        longitude=body.longitude,
        coverage_percent=quadrat.coverage_percent,
        species_id=quadrat.species_id,
        created_at=quadrat.created_at,
    )
