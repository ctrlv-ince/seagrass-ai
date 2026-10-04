"""Wave attenuation model endpoints."""

from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.prediction import WaveAttenuationPrediction
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.wave_model import WaveAttenuationModel

router = APIRouter()
wave_service = WaveAttenuationModel()


@router.post("/wave-attenuation", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def predict_wave_attenuation(
    body: PredictionRequest,
    db: AsyncSession = Depends(get_db),
) -> WaveAttenuationPrediction:
    """Predict wave attenuation based on seagrass meadow canopy parameters and wave characteristics.

    Applies the Mendez & Losada (2004) hydrodynamic vegetation damping formulation
    to calculate wave height reduction, energy dissipation percentage, and transect profile.
    Saves the prediction result to the Supabase database.
    """
    prediction_result = await wave_service.predict(
        seagrass_density=body.seagrass_density,
        blade_length_cm=body.blade_length_cm,
        water_depth_m=body.water_depth_m,
        wave_height_m=body.wave_height_m,
        wave_period_s=body.wave_period_s,
    )

    db_prediction = WaveAttenuationPrediction(
        survey_id=body.survey_id,
        model_version=prediction_result["model_version"],
        seagrass_density=body.seagrass_density,
        blade_length_cm=body.blade_length_cm,
        water_depth_m=body.water_depth_m,
        wave_height_m=body.wave_height_m,
        wave_period_s=body.wave_period_s,
        attenuation_percent=prediction_result["attenuation_percent"],
        confidence_lower=prediction_result["confidence_lower"],
        confidence_upper=prediction_result["confidence_upper"],
        raw_output=prediction_result["raw_output"],
    )

    db.add(db_prediction)
    await db.commit()
    await db.refresh(db_prediction)

    return db_prediction


@router.get("/wave-attenuation/{prediction_id}", response_model=PredictionResponse)
async def get_prediction_by_id(
    prediction_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> WaveAttenuationPrediction:
    """Retrieve a past wave attenuation prediction by its UUID."""
    stmt = select(WaveAttenuationPrediction).where(WaveAttenuationPrediction.id == prediction_id)
    res = await db.execute(stmt)
    prediction = res.scalar_one_or_none()

    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction with ID {prediction_id} not found",
        )

    return prediction


@router.get("/wave-attenuation/survey/{survey_id}", response_model=List[PredictionResponse])
async def get_predictions_for_survey(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> list[WaveAttenuationPrediction]:
    """Retrieve all wave attenuation predictions associated with a specific survey."""
    stmt = (
        select(WaveAttenuationPrediction)
        .where(WaveAttenuationPrediction.survey_id == survey_id)
        .order_by(WaveAttenuationPrediction.created_at.desc())
    )
    res = await db.execute(stmt)
    return list(res.scalars().all())
