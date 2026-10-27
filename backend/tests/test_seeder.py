"""Tests for the administrator account seeder."""

from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.scripts.seed_admin import (
    DEMO_ADMIN_ID,
    generate_secure_password,
    seed_admin,
    seed_in_supabase_auth,
)


def test_generate_secure_password():
    """Verify password length and character complexity."""
    pwd = generate_secure_password(length=20)
    assert len(pwd) == 20
    assert any(c.isupper() for c in pwd)
    assert any(c.islower() for c in pwd)
    assert any(c.isdigit() for c in pwd)
    assert any(c in "!@#$%^&*" for c in pwd)


@pytest.mark.asyncio
async def test_seed_admin_demo_mode():
    """Test demo mode seeding returns fixed demo admin info."""
    mock_profile = AsyncMock()
    mock_profile.id = uuid.uuid4()
    mock_profile.auth_user_id = DEMO_ADMIN_ID
    mock_profile.email = "admin@seagrass.demo"
    mock_profile.full_name = "Demo Administrator"
    mock_profile.role = "admin"
    mock_profile.is_active = True

    with patch("app.scripts.seed_admin.upsert_user_profile", return_value=mock_profile) as mock_upsert:
        res = await seed_admin(is_demo=True)
        assert res["status"] == "success"
        assert res["mode"] == "demo"
        assert res["email"] == "admin@seagrass.demo"
        assert res["role"] == "admin"
        assert res["auth_user_id"] == str(DEMO_ADMIN_ID)
        mock_upsert.assert_awaited_once()


@pytest.mark.asyncio
async def test_seed_admin_db_only_mode():
    """Test direct DB-only seeding without Supabase Auth calls."""
    test_id = uuid.uuid4()
    mock_profile = AsyncMock()
    mock_profile.id = test_id
    mock_profile.auth_user_id = test_id
    mock_profile.email = "custom_admin@seagrass.org"
    mock_profile.full_name = "Custom Admin"
    mock_profile.role = "admin"
    mock_profile.is_active = True

    with patch("app.scripts.seed_admin.upsert_user_profile", return_value=mock_profile):
        res = await seed_admin(
            email="custom_admin@seagrass.org",
            full_name="Custom Admin",
            db_only=True,
        )
        assert res["status"] == "success"
        assert res["email"] == "custom_admin@seagrass.org"
        assert res["role"] == "admin"


@pytest.mark.asyncio
async def test_seed_in_supabase_auth_creates_new_user():
    """Test creating a new user via mocked Supabase Admin API."""
    mock_user_id = str(uuid.uuid4())

    def make_mock_res(status_code: int, json_data: dict):
        from unittest.mock import MagicMock
        m = MagicMock()
        m.status_code = status_code
        m.json.return_value = json_data
        m.text = ""
        return m

    async def mock_get(*args, **kwargs):
        return make_mock_res(200, {"users": []})

    async def mock_post(*args, **kwargs):
        return make_mock_res(201, {"id": mock_user_id, "email": "new_admin@seagrass.org"})

    with patch("app.scripts.seed_admin.settings") as mock_settings:
        mock_settings.supabase_url = "https://mock.supabase.co"
        mock_settings.supabase_service_key = "mock-service-key"

        with patch("httpx.AsyncClient.get", side_effect=mock_get):
            with patch("httpx.AsyncClient.post", side_effect=mock_post):
                auth_id, created = await seed_in_supabase_auth(
                    email="new_admin@seagrass.org",
                    password="TestPassword123!",
                    full_name="New Admin",
                    role="admin",
                )
                assert str(auth_id) == mock_user_id
                assert created is True
