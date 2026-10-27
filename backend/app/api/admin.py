"""Admin API router — user management, species CRUD, survey control, and analytics."""

from __future__ import annotations

import logging
import math
import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import require_admin
from app.api.surveys import _format_survey_response
from app.config import settings
from app.database import get_db
from app.models.prediction import WaveAttenuationPrediction
from app.models.seagrass import Quadrat, Species, Transect
from app.models.survey import Survey, SurveyImage
from app.models.user import UserProfile
from app.schemas.admin import (
    AdminAnalyticsResponse,
    BulkSurveyStatusUpdate,
    MonthlySurveyCount,
    SystemInfoResponse,
)
from app.schemas.species import SpeciesCreate, SpeciesResponse, SpeciesUpdate
from app.schemas.survey import SurveyListResponse, SurveyResponse
from app.schemas.user import (
    UserActiveUpdate,
    UserListResponse,
    UserProfileResponse,
    UserRoleUpdate,
)
from app.services.cache import response_cache

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(require_admin)])


# ── Current Admin Profile ──────────────────────────────────────────


@router.get("/me", response_model=UserProfileResponse)
async def get_admin_me(
    current_user: Annotated[UserProfile, Depends(require_admin)],
) -> UserProfileResponse:
    """Get the profile of the currently logged-in administrator."""
    return UserProfileResponse.model_validate(current_user)


# ── User Management ────────────────────────────────────────────────


@router.get("/users", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: str | None = Query(None, description="Filter by role (admin, user)"),
    search: str | None = Query(None, description="Search by email or full name"),
    db: AsyncSession = Depends(get_db),
) -> UserListResponse:
    """List registered users with pagination and search/role filtering."""
    base_query = select(UserProfile)
    count_query = select(func.count(UserProfile.id))

    if role:
        base_query = base_query.where(UserProfile.role == role)
        count_query = count_query.where(UserProfile.role == role)

    if search:
        term = f"%{search.strip()}%"
        condition = (UserProfile.email.ilike(term)) | (UserProfile.full_name.ilike(term))
        base_query = base_query.where(condition)
        count_query = count_query.where(condition)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    offset = (page - 1) * page_size
    stmt = base_query.order_by(UserProfile.created_at.desc()).offset(offset).limit(page_size)
    result = await db.execute(stmt)
    users = result.scalars().all()

    pages = math.ceil(total / page_size) if total > 0 else 1

    return UserListResponse(
        items=[UserProfileResponse.model_validate(u) for u in users],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/users/{user_id}", response_model=UserProfileResponse)
async def get_user_detail(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> UserProfileResponse:
    """Get detail for a specific user profile."""
    result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserProfileResponse.model_validate(user)


@router.patch("/users/{user_id}/role", response_model=UserProfileResponse)
async def update_user_role(
    user_id: uuid.UUID,
    payload: UserRoleUpdate,
    current_user: Annotated[UserProfile, Depends(require_admin)],
    db: AsyncSession = Depends(get_db),
) -> UserProfileResponse:
    """Change a user's assigned role."""
    result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_user.id and payload.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot revoke your own administrative privileges",
        )

    user.role = payload.role
    await db.commit()
    await db.refresh(user)
    return UserProfileResponse.model_validate(user)


@router.patch("/users/{user_id}/active", response_model=UserProfileResponse)
async def toggle_user_active(
    user_id: uuid.UUID,
    payload: UserActiveUpdate,
    current_user: Annotated[UserProfile, Depends(require_admin)],
    db: AsyncSession = Depends(get_db),
) -> UserProfileResponse:
    """Enable or disable a user account."""
    result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_user.id and not payload.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )

    user.is_active = payload.is_active
    await db.commit()
    await db.refresh(user)
    return UserProfileResponse.model_validate(user)


# ── Species Reference CRUD ─────────────────────────────────────────


@router.get("/species", response_model=list[SpeciesResponse])
async def list_species(
    db: AsyncSession = Depends(get_db),
) -> list[SpeciesResponse]:
    """List all registered seagrass species ordered by scientific name."""
    result = await db.execute(select(Species).order_by(Species.scientific_name.asc()))
    species_list = result.scalars().all()
    return [SpeciesResponse.model_validate(s) for s in species_list]


@router.post("/species", response_model=SpeciesResponse, status_code=status.HTTP_201_CREATED)
async def create_species(
    payload: SpeciesCreate,
    db: AsyncSession = Depends(get_db),
) -> SpeciesResponse:
    """Create a new species in the catalog."""
    existing = await db.execute(
        select(Species).where(Species.scientific_name.ilike(payload.scientific_name.strip()))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Species '{payload.scientific_name}' already exists",
        )

    species = Species(
        scientific_name=payload.scientific_name.strip(),
        common_name=payload.common_name.strip() if payload.common_name else None,
        description=payload.description.strip() if payload.description else None,
    )
    db.add(species)
    await db.commit()
    await db.refresh(species)

    response_cache.invalidate("species:")
    return SpeciesResponse.model_validate(species)


@router.patch("/species/{species_id}", response_model=SpeciesResponse)
async def update_species(
    species_id: uuid.UUID,
    payload: SpeciesUpdate,
    db: AsyncSession = Depends(get_db),
) -> SpeciesResponse:
    """Update attributes of an existing species."""
    result = await db.execute(select(Species).where(Species.id == species_id))
    species = result.scalar_one_or_none()
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Species not found")

    if payload.scientific_name is not None:
        new_name = payload.scientific_name.strip()
        # Verify uniqueness
        dupe = await db.execute(
            select(Species).where(
                (Species.scientific_name.ilike(new_name)) & (Species.id != species_id)
            )
        )
        if dupe.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Another species with name '{new_name}' already exists",
            )
        species.scientific_name = new_name

    if payload.common_name is not None:
        species.common_name = payload.common_name.strip() or None

    if payload.description is not None:
        species.description = payload.description.strip() or None

    await db.commit()
    await db.refresh(species)

    response_cache.invalidate("species:")
    return SpeciesResponse.model_validate(species)


@router.delete("/species/{species_id}", status_code=status.HTTP_200_OK)
async def delete_species(
    species_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Delete a species if not referenced by any field quadrats."""
    result = await db.execute(select(Species).where(Species.id == species_id))
    species = result.scalar_one_or_none()
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Species not found")

    # Guard: check if referenced in quadrats
    ref_count = await db.execute(
        select(func.count(Quadrat.id)).where(Quadrat.species_id == species_id)
    )
    count = ref_count.scalar_one()
    if count > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete species: referenced in {count} quadrat samplings",
        )

    await db.delete(species)
    await db.commit()

    response_cache.invalidate("species:")
    return {"message": "Species deleted successfully"}


# ── Survey Admin ───────────────────────────────────────────────────


@router.get("/surveys", response_model=SurveyListResponse)
async def list_admin_surveys(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    survey_status: str | None = Query(None, alias="status"),
    search: str | None = Query(None, description="Search title, surveyor, or location"),
    db: AsyncSession = Depends(get_db),
) -> SurveyListResponse:
    """List all surveys with global administrative search and status filters."""
    base_query = select(Survey)
    count_query = select(func.count(Survey.id))

    if survey_status:
        base_query = base_query.where(Survey.status == survey_status)
        count_query = count_query.where(Survey.status == survey_status)

    if search:
        term = f"%{search.strip()}%"
        cond = (
            Survey.title.ilike(term)
            | Survey.surveyor_name.ilike(term)
            | Survey.location_name.ilike(term)
        )
        base_query = base_query.where(cond)
        count_query = count_query.where(cond)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    offset = (page - 1) * page_size
    stmt = (
        base_query.options(selectinload(Survey.images))
        .order_by(Survey.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(stmt)
    surveys = result.scalars().all()

    return SurveyListResponse(
        items=[_format_survey_response(s) for s in surveys],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.delete("/surveys/{survey_id}", status_code=status.HTTP_200_OK)
async def delete_admin_survey(
    survey_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Delete a survey and its cascaded items."""
    result = await db.execute(select(Survey).where(Survey.id == survey_id))
    survey = result.scalar_one_or_none()
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    await db.delete(survey)
    await db.commit()

    response_cache.invalidate("map:")
    return {"message": "Survey deleted successfully"}


@router.post("/surveys/bulk-status")
async def bulk_update_survey_status(
    payload: BulkSurveyStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    """Bulk update status for a list of surveys."""
    stmt = (
        update(Survey)
        .where(Survey.id.in_(payload.survey_ids))
        .values(status=payload.status, updated_at=func.now())
    )
    res = await db.execute(stmt)
    await db.commit()

    response_cache.invalidate("map:")
    return {"updated": res.rowcount}


# ── Analytics ──────────────────────────────────────────────────────


@router.get("/analytics", response_model=AdminAnalyticsResponse)
async def get_admin_analytics(
    db: AsyncSession = Depends(get_db),
) -> AdminAnalyticsResponse:
    """Retrieve platform aggregate statistics for admin dashboard."""
    # Survey count & breakdown by status
    survey_status_rows = await db.execute(
        select(Survey.status, func.count(Survey.id)).group_by(Survey.status)
    )
    status_map = {row[0]: row[1] for row in survey_status_rows.all()}
    total_surveys = sum(status_map.values())

    # Images, Species, Transects, Quadrats
    total_images = (await db.execute(select(func.count(SurveyImage.id)))).scalar_one()
    total_species = (await db.execute(select(func.count(Species.id)))).scalar_one()
    total_transects = (await db.execute(select(func.count(Transect.id)))).scalar_one()
    total_quadrats = (await db.execute(select(func.count(Quadrat.id)))).scalar_one()

    # User count & breakdown by role
    user_role_rows = await db.execute(
        select(UserProfile.role, func.count(UserProfile.id)).group_by(UserProfile.role)
    )
    role_map = {row[0]: row[1] for row in user_role_rows.all()}
    total_users = sum(role_map.values())

    # Monthly survey trend (surveys created in last 12 months)
    # Using date formatting for month grouping
    monthly_rows = await db.execute(
        select(
            func.to_char(Survey.created_at, "YYYY-MM").label("month"),
            func.count(Survey.id),
        )
        .group_by("month")
        .order_by("month")
        .limit(12)
    )
    monthly_trends = [
        MonthlySurveyCount(month=row[0] or "Unknown", count=row[1])
        for row in monthly_rows.all()
    ]

    # Estimated storage: average 2.5MB per field image
    storage_used_bytes = total_images * 2_500_000

    return AdminAnalyticsResponse(
        total_surveys=total_surveys,
        surveys_by_status=status_map,
        total_images=total_images,
        total_species=total_species,
        total_transects=total_transects,
        total_quadrats=total_quadrats,
        total_users=total_users,
        users_by_role=role_map,
        surveys_monthly_trend=monthly_trends,
        storage_used_bytes=storage_used_bytes,
        yolo_model_version="YOLOv11-Seagrass-v1",
    )


# ── System Settings / Diagnostics ──────────────────────────────────


@router.get("/system", response_model=SystemInfoResponse)
async def get_system_info(
    db: AsyncSession = Depends(get_db),
) -> SystemInfoResponse:
    """Retrieve operational diagnostics and environment configuration."""
    db_ok = False
    try:
        await db.execute(select(func.now()))
        db_ok = True
    except Exception as exc:
        logger.error("DB health check failed: %s", exc)

    return SystemInfoResponse(
        status="healthy" if db_ok else "degraded",
        database_connected=db_ok,
        yolo_model_path=settings.yolo_model_path,
        s3_bucket=settings.s3_bucket_name,
        cache_entries=response_cache.size,
        environment="development" if settings.debug else "production",
    )
