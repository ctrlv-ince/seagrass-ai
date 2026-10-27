"""Add user_profiles table for role-based access control.

Revision ID: 0002_add_user_profiles
Revises: 0001_add_perf_indexes
Create Date: 2026-10-23 00:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "0002_add_user_profiles"
down_revision: Union[str, None] = "0001_add_perf_indexes"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_profiles",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("auth_user_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column(
            "role",
            sa.String(length=20),
            server_default=sa.text("'user'"),
            nullable=False,
        ),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "role IN ('admin', 'user')",
            name="ck_user_profiles_role",
        ),
    )

    op.create_index(
        "ix_user_profiles_auth_user_id",
        "user_profiles",
        ["auth_user_id"],
        unique=True,
        if_not_exists=True,
    )
    op.create_index(
        "ix_user_profiles_email",
        "user_profiles",
        ["email"],
        if_not_exists=True,
    )
    op.create_index(
        "ix_user_profiles_role",
        "user_profiles",
        ["role"],
        if_not_exists=True,
    )
    op.create_index(
        "ix_user_profiles_created",
        "user_profiles",
        [sa.text("created_at DESC")],
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("ix_user_profiles_created", table_name="user_profiles", if_exists=True)
    op.drop_index("ix_user_profiles_role", table_name="user_profiles", if_exists=True)
    op.drop_index("ix_user_profiles_email", table_name="user_profiles", if_exists=True)
    op.drop_index("ix_user_profiles_auth_user_id", table_name="user_profiles", if_exists=True)
    op.drop_table("user_profiles")
