"""FastAPI application factory.

Uses the create_app() factory pattern for testability — tests can
create isolated app instances with dependency overrides.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown lifecycle."""
    # Startup: initialize resources (DB pool, ML models, etc.)
    yield
    # Shutdown: cleanup resources


def create_app() -> FastAPI:
    """Application factory — creates and configures a FastAPI instance."""
    app = FastAPI(
        title="Seagrass Assessment API",
        description="AI-Powered Seagrass Meadow Assessment and Decision Support System",
        version="0.1.0",
        lifespan=lifespan,
    )

    # CORS — origins are environment-specific per ECC security rules
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health", tags=["Health"])
    async def health_check() -> dict[str, str]:
        """Health check endpoint for container probes and load balancers."""
        return {"status": "ok", "app": "Seagrass Assessment API"}

    return app


app = create_app()
