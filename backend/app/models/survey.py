"""Survey session, image, and GPS ORM models."""

from __future__ import annotations

import uuid
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Float, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Survey(Base):
    """A field survey session."""

    __tablename__ = "surveys"
    __table_args__ = (
        Index("ix_surveys_status_created", "status", "created_at"),
        Index("ix_surveys_created", "created_at"),
        Index("ix_surveys_center_point", "center_point", postgresql_using="gist"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    surveyor_name: Mapped[str | None] = mapped_column(String(255))
    location_name: Mapped[str | None] = mapped_column(String(255))
    center_point: Mapped[str | None] = mapped_column(Geometry("POINT", srid=4326))
    status: Mapped[str] = mapped_column(String(50), default="draft")

    # Relationships
    images: Mapped[list[SurveyImage]] = relationship(back_populates="survey")

    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class SurveyImage(Base):
    """An image captured during a survey."""

    __tablename__ = "survey_images"
    __table_args__ = (
        Index("ix_survey_images_survey_created", "survey_id", "created_at"),
        Index("ix_survey_images_location", "location", postgresql_using="gist"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    survey_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("surveys.id"), index=True
    )
    filename: Mapped[str] = mapped_column(String(512))
    s3_key: Mapped[str] = mapped_column(String(1024))
    content_type: Mapped[str] = mapped_column(String(100), default="image/jpeg")
    gps_latitude: Mapped[float | None] = mapped_column(Float)
    gps_longitude: Mapped[float | None] = mapped_column(Float)
    location: Mapped[str | None] = mapped_column(Geometry("POINT", srid=4326))

    # Relationships
    survey: Mapped[Survey] = relationship(back_populates="images")

    captured_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
