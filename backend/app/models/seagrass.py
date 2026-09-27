"""Seagrass species, quadrats, and transect ORM models."""

from __future__ import annotations

import uuid
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Species(Base):
    """Seagrass species reference table."""

    __tablename__ = "species"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    scientific_name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    common_name: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Transect(Base):
    """A survey transect line across a seagrass meadow."""

    __tablename__ = "transects"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    survey_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("surveys.id"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    geometry: Mapped[str] = mapped_column(Geometry("LINESTRING", srid=4326))

    # Relationships
    quadrats: Mapped[list[Quadrat]] = relationship(back_populates="transect")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Quadrat(Base):
    """A quadrat sampling point along a transect."""

    __tablename__ = "quadrats"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    transect_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("transects.id"), index=True
    )
    position_along_transect: Mapped[float] = mapped_column(Float)
    location: Mapped[str] = mapped_column(Geometry("POINT", srid=4326))
    coverage_percent: Mapped[float | None] = mapped_column(Float)
    species_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("species.id")
    )

    # Relationships
    transect: Mapped[Transect] = relationship(back_populates="quadrats")
    species: Mapped[Species | None] = relationship()

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
