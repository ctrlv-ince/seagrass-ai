"""Survey and image upload schemas."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# ── Survey ────────────────────────────────────────────────────


class SurveyCreate(BaseModel):
    """Request schema for creating a survey."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    surveyor_name: str | None = Field(None, max_length=255)
    location_name: str | None = Field(None, max_length=255)
    center_latitude: float | None = Field(None, ge=-90, le=90)
    center_longitude: float | None = Field(None, ge=-180, le=180)


class SurveyUpdate(BaseModel):
    """Request schema for updating a survey."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    surveyor_name: str | None = Field(None, max_length=255)
    location_name: str | None = Field(None, max_length=255)
    status: str | None = Field(None, pattern=r"^(draft|in_progress|completed)$")


class SurveyResponse(BaseModel):
    """Response schema for a survey."""

    id: uuid.UUID
    title: str
    description: str | None
    surveyor_name: str | None
    location_name: str | None
    status: str
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SurveyListResponse(BaseModel):
    """Paginated list of surveys."""

    items: list[SurveyResponse]
    total: int
    page: int
    page_size: int


# ── Survey Image ──────────────────────────────────────────────


class SurveyImageResponse(BaseModel):
    """Response schema for a survey image."""

    id: uuid.UUID
    survey_id: uuid.UUID
    filename: str
    content_type: str
    gps_latitude: float | None
    gps_longitude: float | None
    captured_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
