"""YOLOv11 inference endpoints.

Image upload → detection → structured results.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter()


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(..., description="Seagrass image for detection"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Run YOLOv11 inference on an uploaded image.

    Returns detected species, bounding boxes, and confidence scores.

    TODO: Wire up yolo_service.py once model is trained/downloaded.
    """
    return {
        "status": "not_implemented",
        "message": "YOLOv11 inference endpoint — wire up after model training",
        "filename": file.filename,
    }
