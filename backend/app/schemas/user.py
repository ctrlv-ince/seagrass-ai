"""User and profile schemas for role-based access control and admin management."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

UserRole = Literal["admin", "user"]


class UserProfileResponse(BaseModel):
    """User profile response representation."""

    id: uuid.UUID
    auth_user_id: uuid.UUID
    email: str
    full_name: str | None = None
    role: str
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class UserRoleUpdate(BaseModel):
    """Request schema for updating a user's role."""

    role: UserRole = Field(..., description="Target role: admin or user")


class UserActiveUpdate(BaseModel):
    """Request schema for enabling or disabling a user account."""

    is_active: bool = Field(..., description="Whether the user account is active")


class UserListResponse(BaseModel):
    """Paginated user profile response."""

    items: list[UserProfileResponse]
    total: int
    page: int
    page_size: int
    pages: int
