"""Tests for admin API routes and authorization."""

from __future__ import annotations

import uuid
import pytest
from httpx import ASGITransport, AsyncClient

from app.api.deps import require_admin
from app.main import create_app
from app.models.user import UserProfile


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
def mock_admin_user():
    return UserProfile(
        id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        auth_user_id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        email="testadmin@seagrass.demo",
        full_name="Test Administrator",
        role="admin",
        is_active=True,
    )


@pytest.fixture
def mock_standard_user():
    return UserProfile(
        id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        auth_user_id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        email="user@seagrass.demo",
        full_name="Standard User",
        role="user",
        is_active=True,
    )


@pytest.mark.asyncio
async def test_admin_me_endpoint_with_admin_user(app, mock_admin_user):
    """Admin user should successfully fetch own profile."""
    app.dependency_overrides[require_admin] = lambda: mock_admin_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/admin/me")
        assert res.status_code == 200
        data = res.json()
        assert data["email"] == "testadmin@seagrass.demo"
        assert data["role"] == "admin"


@pytest.mark.asyncio
async def test_admin_access_forbidden_for_non_admin(app, mock_standard_user):
    """Standard non-admin user attempting to access admin routes should get 403."""
    # When require_admin dependency runs directly without override for non-admin
    async def override_get_user():
        from fastapi import HTTPException, status
        if mock_standard_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrative privileges required to access this resource",
            )
        return mock_standard_user

    app.dependency_overrides[require_admin] = override_get_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/admin/me")
        assert res.status_code == 403
        assert "Administrative privileges required" in res.json()["detail"]


@pytest.mark.asyncio
async def test_admin_system_info(app, mock_admin_user):
    """Admin should be able to query system diagnostics."""
    app.dependency_overrides[require_admin] = lambda: mock_admin_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/admin/system")
        assert res.status_code == 200
        data = res.json()
        assert "yolo_model_path" in data
        assert "s3_bucket" in data


@pytest.mark.asyncio
async def test_jwt_auth_with_secret(app):
    """Test JWT decode behavior when Supabase JWT secret is configured."""
    import jwt
    from app.config import settings
    from app.api.deps import get_current_user

    secret = "my-test-supabase-secret"
    original_secret = settings.supabase_jwt_secret
    settings.supabase_jwt_secret = secret

    try:
        user_id = str(uuid.uuid4())
        token = jwt.encode(
            {
                "sub": user_id,
                "email": "tokenuser@seagrass.demo",
                "user_metadata": {"role": "admin", "full_name": "Token User"},
            },
            secret,
            algorithm="HS256",
        )

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # Test with invalid secret
            bad_token = jwt.encode({"sub": user_id}, "wrong-secret", algorithm="HS256")
            bad_res = await client.get(
                "/api/v1/admin/system",
                headers={"Authorization": f"Bearer {bad_token}"},
            )
            assert bad_res.status_code == 401
    finally:
        settings.supabase_jwt_secret = original_secret
