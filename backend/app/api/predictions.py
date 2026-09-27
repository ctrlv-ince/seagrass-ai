"""Wave attenuation model endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.prediction import PredictionRequest, PredictionResponse

router = APIRouter()


@router.post("/wave-attenuation", response_model=PredictionResponse)
async def predict_wave_attenuation(
    body: PredictionRequest,
    db: AsyncSession = Depends(get_db),
) -> PredictionResponse:
    """Predict wave attenuation based on seagrass meadow parameters.

    TODO: Wire up wave_model.py service with trained regression model.
    """
    raise NotImplementedError(
        "Wave attenuation prediction endpoint — wire up after model training"
    )
