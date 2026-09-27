"""Shared test fixtures.

Provides an isolated FastAPI test client with dependency overrides
per ECC testing rules.
"""

from __future__ import annotations

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import create_app


@pytest_asyncio.fixture
async def client() -> AsyncIterator[AsyncClient]:
    """Async test client with a fresh app instance.

    Each test gets its own app via create_app() so dependency
    overrides don't leak between tests.
    """
    app = create_app()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    # Clear dependency overrides after test (ECC rule)
    app.dependency_overrides.clear()
