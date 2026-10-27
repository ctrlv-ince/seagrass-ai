"""Authentication and authorization dependencies for FastAPI endpoints."""

from __future__ import annotations

import logging
import uuid
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import UserProfile

logger = logging.getLogger(__name__)

security_scheme = HTTPBearer(auto_error=False)

# Fixed UUID for demo admin user
DEMO_ADMIN_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


async def get_or_create_demo_user(db: AsyncSession) -> UserProfile:
    """Ensure a demo admin user exists in the database for local/demo runs."""
    stmt = select(UserProfile).where(UserProfile.auth_user_id == DEMO_ADMIN_ID)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        user = UserProfile(
            id=DEMO_ADMIN_ID,
            auth_user_id=DEMO_ADMIN_ID,
            email="admin@seagrass.demo",
            full_name="Demo Administrator",
            role="admin",
            is_active=True,
        )
        db.add(user)
        try:
            await db.commit()
            await db.refresh(user)
        except Exception:
            await db.rollback()
            # If commit fails (e.g. SQLite test engine or concurrent insert), query again
            res = await db.execute(stmt)
            user = res.scalar_one_or_none() or user
    return user


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserProfile:
    """Extract and verify the current user from Bearer JWT or demo credentials."""
    # 1. Handle demo mode if no credentials provided or if token starts with "demo"
    token = credentials.credentials if credentials else None

    is_demo_token = token is not None and (
        token.startswith("demo-") or token.startswith("demo_") or token == "demo-token"
    )

    if (not token or is_demo_token) and (not settings.supabase_jwt_secret or is_demo_token):
        if settings.debug or is_demo_token:
            return await get_or_create_demo_user(db)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Decode Supabase JWT
    try:
        # Supabase JWTs typically use HS256 with the supabase_jwt_secret
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False, "verify_signature": bool(settings.supabase_jwt_secret)},
        )
    except jwt.PyJWTError as exc:
        logger.warning("JWT verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    # 3. Extract user metadata
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        auth_user_id = uuid.UUID(sub)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid subject UUID format",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    email = payload.get("email") or f"{sub}@supabase.user"
    user_metadata = payload.get("user_metadata", {}) or {}
    full_name = user_metadata.get("full_name") or user_metadata.get("name")
    claimed_role = user_metadata.get("role") or payload.get("role") or "user"
    if claimed_role != "admin":
        claimed_role = "user"

    # 4. Lookup or create UserProfile
    stmt = select(UserProfile).where(UserProfile.auth_user_id == auth_user_id)
    result = await db.execute(stmt)
    user_profile = result.scalar_one_or_none()

    if not user_profile:
        user_profile = UserProfile(
            auth_user_id=auth_user_id,
            email=email,
            full_name=full_name,
            role=claimed_role,
            is_active=True,
        )
        db.add(user_profile)
        try:
            await db.commit()
            await db.refresh(user_profile)
        except Exception as exc:
            await db.rollback()
            logger.error("Failed to persist user profile: %s", exc)
            # Re-fetch in case of concurrent insert
            res = await db.execute(stmt)
            user_profile = res.scalar_one_or_none()
            if not user_profile:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to initialize user profile",
                )

    if not user_profile.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Contact an administrator.",
        )

    return user_profile


async def require_admin(
    current_user: Annotated[UserProfile, Depends(get_current_user)],
) -> UserProfile:
    """Ensure the authenticated user has admin privileges."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this resource",
        )
    return current_user
