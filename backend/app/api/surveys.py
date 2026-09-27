"""Survey CRUD endpoints.

Routers are kept thin — business logic lives in services.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.survey import Survey
from app.schemas.survey import (
    SurveyCreate,
    SurveyListResponse,
    SurveyResponse,
    SurveyUpdate,
)

router = APIRouter()


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
        select(Survey).order_by(Survey.created_at.desc()).offset(offset).limit(page_size)
    )
    surveys = result.scalars().all()

    return SurveyListResponse(
        items=[SurveyResponse.model_validate(s) for s in surveys],
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
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    return SurveyResponse.model_validate(survey)


@router.post("/", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def create_survey(
    body: SurveyCreate,
    db: AsyncSession = Depends(get_db),
) -> SurveyResponse:
    """Create a new survey."""
    survey = Survey(
        title=body.title,
        description=body.description,
        surveyor_name=body.surveyor_name,
        location_name=body.location_name,
    )
    db.add(survey)
    await db.flush()
    await db.refresh(survey)
    return SurveyResponse.model_validate(survey)


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
    for field, value in update_data.items():
        setattr(survey, field, value)

    await db.flush()
    await db.refresh(survey)
    return SurveyResponse.model_validate(survey)


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
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
