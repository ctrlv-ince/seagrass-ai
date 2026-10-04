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

    # ── App ───────────────────────────────────────────────────
    debug: bool = Field(default=True)
    log_level: str = Field(default="info")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


settings = Settings()
