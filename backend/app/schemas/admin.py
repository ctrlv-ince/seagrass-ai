"""Admin dashboard, analytics, and bulk action schemas."""

from __future__ import annotations

import uuid
from typing import Any, Literal

from pydantic import BaseModel, Field


class BulkSurveyStatusUpdate(BaseModel):
    """Payload for updating status of multiple surveys at once."""

    survey_ids: list[uuid.UUID] = Field(..., min_length=1)
    status: Literal["draft", "in_progress", "completed"]


class MonthlySurveyCount(BaseModel):
    """Survey count for a specific month."""

    month: str  # YYYY-MM
    count: int


class AdminAnalyticsResponse(BaseModel):
    """Aggregate statistics for admin dashboard."""

    total_surveys: int
    surveys_by_status: dict[str, int]
    total_images: int
    total_species: int
    total_transects: int
    total_quadrats: int
    total_users: int
    users_by_role: dict[str, int]
    surveys_monthly_trend: list[MonthlySurveyCount]
    storage_used_bytes: int
    yolo_model_version: str


class SystemInfoResponse(BaseModel):
    """System health and operational status."""

    status: str
    database_connected: bool
    yolo_model_path: str
    s3_bucket: str
    cache_entries: int
    environment: str
