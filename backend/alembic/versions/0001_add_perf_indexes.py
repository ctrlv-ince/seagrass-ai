"""Add performance indexes for surveys, transects, quadrats, images, and predictions.

Revision ID: 0001_add_perf_indexes
Revises: None
Create Date: 2026-10-04 15:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0001_add_perf_indexes"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── surveys ──────────────────────────────────────────
    op.create_index(
        "ix_surveys_status_created",
        "surveys",
        ["status", sa.text("created_at DESC")],
        if_not_exists=True,
    )
    op.create_index(
        "ix_surveys_created",
        "surveys",
        [sa.text("created_at DESC")],
        if_not_exists=True,
    )
    op.create_index(
        "ix_surveys_center_point",
        "surveys",
        ["center_point"],
        postgresql_using="gist",
        if_not_exists=True,
    )

    # ── survey_images ────────────────────────────────────
    op.create_index(
        "ix_survey_images_survey_created",
        "survey_images",
        ["survey_id", sa.text("created_at DESC")],
        if_not_exists=True,
    )
    op.create_index(
        "ix_survey_images_location",
        "survey_images",
        ["location"],
        postgresql_using="gist",
        if_not_exists=True,
    )

    # ── transects ────────────────────────────────────────
    op.create_index(
        "ix_transects_survey_created",
        "transects",
        ["survey_id", "created_at"],
        if_not_exists=True,
    )
    op.create_index(
        "ix_transects_geometry",
        "transects",
        ["geometry"],
        postgresql_using="gist",
        if_not_exists=True,
    )

    # ── quadrats ─────────────────────────────────────────
    op.create_index(
        "ix_quadrats_transect_position",
        "quadrats",
        ["transect_id", "position_along_transect"],
        if_not_exists=True,
    )
    op.create_index(
        "ix_quadrats_species",
        "quadrats",
        ["species_id"],
        if_not_exists=True,
    )
    op.create_index(
        "ix_quadrats_location",
        "quadrats",
        ["location"],
        postgresql_using="gist",
        if_not_exists=True,
    )

    # ── wave_attenuation_predictions ─────────────────────
    op.create_index(
        "ix_predictions_survey_created",
        "wave_attenuation_predictions",
        ["survey_id", sa.text("created_at DESC")],
        if_not_exists=True,
    )
    op.create_index(
        "ix_predictions_created",
        "wave_attenuation_predictions",
        [sa.text("created_at DESC")],
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("ix_predictions_created", table_name="wave_attenuation_predictions", if_exists=True)
    op.drop_index("ix_predictions_survey_created", table_name="wave_attenuation_predictions", if_exists=True)
    op.drop_index("ix_quadrats_location", table_name="quadrats", if_exists=True)
    op.drop_index("ix_quadrats_species", table_name="quadrats", if_exists=True)
    op.drop_index("ix_quadrats_transect_position", table_name="quadrats", if_exists=True)
    op.drop_index("ix_transects_geometry", table_name="transects", if_exists=True)
    op.drop_index("ix_transects_survey_created", table_name="transects", if_exists=True)
    op.drop_index("ix_survey_images_location", table_name="survey_images", if_exists=True)
    op.drop_index("ix_survey_images_survey_created", table_name="survey_images", if_exists=True)
    op.drop_index("ix_surveys_center_point", table_name="surveys", if_exists=True)
    op.drop_index("ix_surveys_created", table_name="surveys", if_exists=True)
    op.drop_index("ix_surveys_status_created", table_name="surveys", if_exists=True)
