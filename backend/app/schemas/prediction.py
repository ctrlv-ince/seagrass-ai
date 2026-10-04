"""Wave attenuation prediction schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Request schema for wave attenuation prediction."""

    survey_id: uuid.UUID | None = None
    seagrass_density: float = Field(..., gt=0, description="Shoots per m²")
    blade_length_cm: float = Field(..., gt=0, description="Average blade length in cm")
    water_depth_m: float = Field(..., gt=0, description="Water depth in meters")
    wave_height_m: float = Field(..., gt=0, description="Incident wave height in meters")
    wave_period_s: float = Field(..., gt=0, description="Wave period in seconds")


class PredictionResponse(BaseModel):
    """Response schema for a wave attenuation prediction."""

    id: uuid.UUID
    survey_id: uuid.UUID | None
    model_version: str
    seagrass_density: float
    blade_length_cm: float
    water_depth_m: float
    wave_height_m: float
    wave_period_s: float
    attenuation_percent: float
    confidence_lower: float | None
    confidence_upper: float | None
    raw_output: dict[str, Any] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
