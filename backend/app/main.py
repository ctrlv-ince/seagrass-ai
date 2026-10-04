"""FastAPI application factory.

Uses the create_app() factory pattern for testability — tests can
create isolated app instances with dependency overrides.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.api.router import api_router


# ── Cache-Control header rules keyed by URL prefix ──────────
_CACHE_RULES: list[tuple[str, str]] = [
    ("/api/v1/detections/species", "public, max-age=3600"),
    ("/api/v1/maps/", "public, max-age=300, stale-while-revalidate=60"),
    ("/api/v1/surveys", "private, max-age=30"),
    ("/health", "no-cache"),
]


class CacheControlMiddleware(BaseHTTPMiddleware):
    """Set Cache-Control headers based on request method and path."""

    async def dispatch(self, request: Request, call_next) -> Response:  # type: ignore[override]
        response: Response = await call_next(request)

        # Never cache mutations
        if request.method not in ("GET", "HEAD"):
            response.headers["Cache-Control"] = "no-store"
            return response

        # Match against rules (first match wins)
        for prefix, directive in _CACHE_RULES:
            if request.url.path.startswith(prefix):
                response.headers["Cache-Control"] = directive
                return response

        return response


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

    # GZip — compress JSON/GeoJSON responses larger than 500 bytes
    app.add_middleware(GZipMiddleware, minimum_size=500)

    # Cache-Control headers — set per-endpoint caching policy
    app.add_middleware(CacheControlMiddleware)

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
