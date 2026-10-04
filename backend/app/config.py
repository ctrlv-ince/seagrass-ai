"""Application configuration via Pydantic BaseSettings.

Settings are loaded from environment variables and .env files.
"""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Database (Supabase PostgreSQL + PostGIS) ────────────────
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:password@localhost:5432/seagrass",
        description=(
            "Async PostgreSQL connection string. "
            "For Supabase use the transaction-mode pooler on port 6543."
        ),
    )

    # ── Supabase Platform ─────────────────────────────────────
    supabase_url: str = Field(
        default="",
        description="Supabase project URL (e.g. https://xxxx.supabase.co)",
    )
    supabase_service_key: str = Field(
        default="",
        description="Supabase service-role key for server-side access",
    )

    # ── Object Storage (S3-compatible) ─────────────────────────
    s3_endpoint_url: str = Field(default="")
    s3_access_key: str = Field(default="")
    s3_secret_key: str = Field(default="")
    s3_bucket_name: str = Field(default="seagrass-images")

    # ── YOLOv11 Model ─────────────────────────────────────────
    yolo_model_path: str = Field(default="models/seagrass_yolov11.pt")

    # ── Security ──────────────────────────────────────────────
    secret_key: str = Field(default="change-me-in-production")
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:8081"],
    )

    # ── Database Connection Pooling ────────────────────────────
    db_pool_size: int = Field(
        default=5,
        description="Number of persistent connections in the pool.",
    )
    db_max_overflow: int = Field(
        default=10,
        description="Max temporary connections above pool_size.",
    )
    db_pool_recycle: int = Field(
        default=1800,
        description="Recycle connections after N seconds (default 30 min).",
    )

    # ── Server-Side Caching ───────────────────────────────────
    cache_ttl_species: int = Field(
        default=3600, description="TTL for species catalog cache (seconds)."
    )
    cache_ttl_geojson: int = Field(
        default=300, description="TTL for GeoJSON endpoint cache (seconds)."
    )
    cache_ttl_predictions: int = Field(
        default=600, description="TTL for wave prediction cache (seconds)."
    )
    cache_max_entries: int = Field(
        default=256, description="Max in-memory cache entries before eviction."
    )

    # ── App ───────────────────────────────────────────────────
    debug: bool = Field(default=True)
    log_level: str = Field(default="info")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


settings = Settings()
