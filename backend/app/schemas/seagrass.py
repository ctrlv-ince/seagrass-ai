"""Seagrass species, transect, and quadrat schemas.

Request and response schemas are kept separate per ECC FastAPI rules.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# ── Species ───────────────────────────────────────────────────


class SpeciesCreate(BaseModel):
    """Request schema for creating a species."""

    scientific_name: str = Field(..., min_length=1, max_length=255)
    common_name: str | None = None
    description: str | None = None


class SpeciesResponse(BaseModel):
    """Response schema for a species."""

    id: uuid.UUID
    scientific_name: str
    common_name: str | None
    description: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Transect ──────────────────────────────────────────────────


class TransectCreate(BaseModel):
    """Request schema for creating a transect."""

    survey_id: uuid.UUID
    name: str = Field(..., min_length=1, max_length=255)
    geometry_wkt: str = Field(
        ..., description="WKT LINESTRING geometry in EPSG:4326"
    )


class TransectResponse(BaseModel):
    """Response schema for a transect."""

    id: uuid.UUID
    survey_id: uuid.UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Quadrat ───────────────────────────────────────────────────


class QuadratCreate(BaseModel):
    """Request schema for creating a quadrat."""

    transect_id: uuid.UUID
    position_along_transect: float = Field(..., ge=0.0, le=1.0)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    coverage_percent: float | None = Field(None, ge=0, le=100)
    species_id: uuid.UUID | None = None


class QuadratResponse(BaseModel):
    """Response schema for a quadrat."""

    id: uuid.UUID
    transect_id: uuid.UUID
    position_along_transect: float
    coverage_percent: float | None
    species_id: uuid.UUID | None
    created_at: datetime

    model_config = {"from_attributes": True}
