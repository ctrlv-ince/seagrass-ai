"""Wave attenuation prediction ORM models."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WaveAttenuationPrediction(Base):
    """A wave attenuation prediction result."""

    __tablename__ = "wave_attenuation_predictions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    survey_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("surveys.id"), index=True
    )
    model_version: Mapped[str] = mapped_column(String(50))

    # Input parameters
    seagrass_density: Mapped[float] = mapped_column(Float)
    blade_length_cm: Mapped[float] = mapped_column(Float)
    water_depth_m: Mapped[float] = mapped_column(Float)
    wave_height_m: Mapped[float] = mapped_column(Float)
    wave_period_s: Mapped[float] = mapped_column(Float)

    # Prediction outputs
    attenuation_percent: Mapped[float] = mapped_column(Float)
    confidence_lower: Mapped[float | None] = mapped_column(Float)
    confidence_upper: Mapped[float | None] = mapped_column(Float)

    # Full model output for debugging/analysis
    raw_output: Mapped[dict | None] = mapped_column(JSONB)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
