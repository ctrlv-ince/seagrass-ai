"""Async SQLAlchemy engine and session management.

Uses asyncpg for async PostgreSQL access. Database sessions are
provided via FastAPI dependency injection — never create sessions
directly inside route handlers.
"""

import re
from collections.abc import AsyncIterator

from sqlalchemy.pool import NullPool
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


def _uses_supabase_pooler(url: str) -> bool:
    """Detect if the connection string points to Supabase's transaction-mode
    pooler (port 6543).  When it does, Supabase already multiplexes
    connections so SQLAlchemy should use NullPool to avoid double-pooling."""
    match = re.search(r":(\d+)/", url)
    return match is not None and match.group(1) == "6543"


_is_pooler = _uses_supabase_pooler(settings.database_url)

_pool_kwargs: dict = (
    # Supabase pooler → let Supabase handle connection reuse
    {"poolclass": NullPool}
    if _is_pooler
    else {
        "pool_size": settings.db_pool_size,
        "max_overflow": settings.db_max_overflow,
        "pool_recycle": settings.db_pool_recycle,
        "pool_pre_ping": True,
    }
)

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    **_pool_kwargs,
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
    },
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""

    pass


async def get_db() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency that yields an async database session.

    Usage::

        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
