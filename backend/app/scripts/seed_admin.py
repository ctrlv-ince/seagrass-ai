"""Admin user seeder for Seagrass AI.

Provisions an administrator account across both Supabase Auth (GoTrue)
and the application's PostgreSQL database (user_profiles table).

Usage:
    python -m app.scripts.seed_admin [OPTIONS]
    python seed_admin.py [OPTIONS]

Examples:
    # Seed default admin (interactive password if not provided):
    python seed_admin.py --email admin@seagrass.org --name "System Administrator"

    # Seed with explicit password:
    python seed_admin.py --email admin@seagrass.org --password "SuperSecret123!"

    # Seed the fixed demo admin user:
    python seed_admin.py --demo

    # Promote an existing user by email without touching Supabase Auth:
    python seed_admin.py --email researcher@seagrass.org --promote-only
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import secrets
import string
import sys
import uuid
from typing import Any

import httpx
from sqlalchemy import select

from app.config import settings
from app.database import async_session_factory
from app.models.user import UserProfile

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

logger = logging.getLogger("seed_admin")
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

DEMO_ADMIN_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def generate_secure_password(length: int = 16) -> str:
    """Generate a high-entropy temporary password."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    # Ensure at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
    pwd = [
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.digits),
        secrets.choice("!@#$%^&*"),
    ]
    pwd += [secrets.choice(alphabet) for _ in range(length - 4)]
    secrets.SystemRandom().shuffle(pwd)
    return "".join(pwd)


async def seed_in_supabase_auth(
    email: str,
    password: str | None,
    full_name: str,
    role: str = "admin",
) -> tuple[uuid.UUID, bool]:
    """Create or update a user in Supabase Auth via GoTrue Admin API.

    Returns:
        tuple[uuid.UUID, bool]: (auth_user_id, was_created_new)
    """
    if not settings.supabase_url or not settings.supabase_service_key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in your .env to provision Supabase Auth users."
        )

    base_url = settings.supabase_url.rstrip("/")
    admin_api_url = f"{base_url}/auth/v1/admin"
    headers = {
        "apikey": settings.supabase_service_key,
        "Authorization": f"Bearer {settings.supabase_service_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        # 1. Search for existing user with this email
        list_res = await client.get(
            f"{admin_api_url}/users",
            params={"page": 1, "per_page": 50},
            headers=headers,
        )

        existing_user: dict[str, Any] | None = None
        if list_res.status_code == 200:
            users_data = list_res.json().get("users", [])
            for u in users_data:
                if u.get("email", "").lower() == email.lower():
                    existing_user = u
                    break

        # 2. Update existing user or create a new user
        if existing_user:
            user_id = uuid.UUID(existing_user["id"])
            logger.info("Found existing user in Supabase Auth (UID: %s). Updating metadata to admin...", user_id)

            update_payload: dict[str, Any] = {
                "email_confirm": True,
                "user_metadata": {
                    **(existing_user.get("user_metadata") or {}),
                    "full_name": full_name,
                    "role": role,
                },
            }
            if password:
                update_payload["password"] = password

            put_res = await client.put(
                f"{admin_api_url}/users/{user_id}",
                headers=headers,
                json=update_payload,
            )
            if put_res.status_code not in (200, 204):
                raise RuntimeError(
                    f"Failed to update user in Supabase Auth: {put_res.status_code} - {put_res.text}"
                )
            return user_id, False

        else:
            # Need to create new user
            if not password:
                password = generate_secure_password()
                logger.info("Generated temporary secure password: %s", password)

            create_payload = {
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": {
                    "full_name": full_name,
                    "role": role,
                },
            }

            post_res = await client.post(
                f"{admin_api_url}/users",
                headers=headers,
                json=create_payload,
            )

            if post_res.status_code not in (200, 201):
                raise RuntimeError(
                    f"Failed to create user in Supabase Auth: {post_res.status_code} - {post_res.text}"
                )

            data = post_res.json()
            user_id = uuid.UUID(data["id"])
            logger.info("Created new user in Supabase Auth (UID: %s)", user_id)
            return user_id, True


async def upsert_user_profile(
    auth_user_id: uuid.UUID,
    email: str,
    full_name: str | None,
    role: str = "admin",
    is_active: bool = True,
) -> UserProfile:
    """Upsert user profile in PostgreSQL user_profiles table."""
    async with async_session_factory() as session:
        # Search by auth_user_id first, then by email
        stmt = select(UserProfile).where(
            (UserProfile.auth_user_id == auth_user_id) | (UserProfile.email == email)
        )
        res = await session.execute(stmt)
        profile = res.scalar_one_or_none()

        if profile:
            profile.auth_user_id = auth_user_id
            profile.email = email
            if full_name:
                profile.full_name = full_name
            profile.role = role
            profile.is_active = is_active
            logger.info("Updating existing database profile (ID: %s)", profile.id)
        else:
            profile = UserProfile(
                auth_user_id=auth_user_id,
                email=email,
                full_name=full_name,
                role=role,
                is_active=is_active,
            )
            session.add(profile)
            logger.info("Inserting new database profile for %s", email)

        await session.commit()
        await session.refresh(profile)
        return profile


async def seed_admin(
    email: str = "admin@seagrass.org",
    password: str | None = None,
    full_name: str = "System Administrator",
    role: str = "admin",
    is_demo: bool = False,
    db_only: bool = False,
    promote_only: bool = False,
) -> dict[str, Any]:
    """Execute the admin provisioning flow."""
    print("=" * 65)
    print(" [SEAGRASS AI] Administrator Account Seeder")
    print("=" * 65)

    if is_demo:
        print("[*] Mode: Demo Administrator (Fixed Mock UUID)")
        profile = await upsert_user_profile(
            auth_user_id=DEMO_ADMIN_ID,
            email="admin@seagrass.demo",
            full_name="Demo Administrator",
            role="admin",
            is_active=True,
        )
        print("\n" + "=" * 65)
        print(" [SUCCESS] DEMO ADMINISTRATOR SEEDED")
        print("=" * 65)
        print(f"  Email:        {profile.email}")
        print(f"  Full Name:    {profile.full_name}")
        print(f"  Role:         {profile.role.upper()}")
        print(f"  Auth UID:     {profile.auth_user_id}")
        print("=" * 65 + "\n")
        return {
            "status": "success",
            "mode": "demo",
            "email": profile.email,
            "full_name": profile.full_name,
            "role": profile.role,
            "auth_user_id": str(profile.auth_user_id),
            "profile_id": str(profile.id),
        }

    auth_id: uuid.UUID
    created_new_supabase = False
    password_used = password

    has_supabase_creds = bool(settings.supabase_url and settings.supabase_service_key)

    if not db_only and not promote_only and has_supabase_creds:
        print(f"[*] Connecting to Supabase GoTrue Auth: {settings.supabase_url}")
        if not password_used:
            password_used = generate_secure_password()

        auth_id, created_new_supabase = await seed_in_supabase_auth(
            email=email,
            password=password_used,
            full_name=full_name,
            role=role,
        )
    else:
        if promote_only:
            print("[*] Mode: Database Profile Promotion Only")
        else:
            print("[*] Mode: Direct Database Seeding (Supabase GoTrue skipped)")

        # In DB-only mode, generate or resolve UUID
        auth_id = uuid.uuid4()
        # Check if an existing profile has an auth_user_id
        async with async_session_factory() as session:
            stmt = select(UserProfile).where(UserProfile.email == email)
            res = await session.execute(stmt)
            existing = res.scalar_one_or_none()
            if existing:
                auth_id = existing.auth_user_id

    # Sync to application database user_profiles table
    print(f"[*] Syncing to PostgreSQL database: {settings.database_url.split('@')[-1] if '@' in settings.database_url else 'local'}")
    profile = await upsert_user_profile(
        auth_user_id=auth_id,
        email=email,
        full_name=full_name,
        role=role,
        is_active=True,
    )

    print("\n" + "=" * 65)
    print(" [SUCCESS] ADMINISTRATOR ACCOUNT READY")
    print("=" * 65)
    print(f"  Email:        {profile.email}")
    if password_used and not promote_only:
        print(f"  Password:     {password_used}")
    print(f"  Full Name:    {profile.full_name}")
    print(f"  Role:         {profile.role.upper()}")
    print(f"  Active:       {profile.is_active}")
    print(f"  Auth UID:     {profile.auth_user_id}")
    print(f"  Profile ID:   {profile.id}")
    print("=" * 65)
    print(" [NEXT STEPS] You can now sign in at http://localhost:5173/login")
    print("              to access the Admin Dashboard (/admin), User Management,")
    print("              Species Catalog, and Survey Control panels.")
    print("=" * 65 + "\n")

    return {
        "status": "success",
        "email": profile.email,
        "password": password_used,
        "full_name": profile.full_name,
        "role": profile.role,
        "auth_user_id": str(profile.auth_user_id),
        "profile_id": str(profile.id),
        "created_new_supabase": created_new_supabase,
    }


def main():
    """CLI entrypoint."""
    parser = argparse.ArgumentParser(
        description="Seagrass AI Administrator Account Seeder",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--email",
        type=str,
        default="admin@seagrass.org",
        help="Email address of the administrator",
    )
    parser.add_argument(
        "--password",
        type=str,
        default=None,
        help="Password for the administrator (auto-generated if omitted)",
    )
    parser.add_argument(
        "--name",
        type=str,
        default="System Administrator",
        help="Full name of the administrator",
    )
    parser.add_argument(
        "--role",
        type=str,
        choices=["admin", "user"],
        default="admin",
        help="Account role to assign",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Seed the predefined demo admin user for local development",
    )
    parser.add_argument(
        "--db-only",
        action="store_true",
        help="Only write to PostgreSQL user_profiles without calling Supabase Auth",
    )
    parser.add_argument(
        "--promote-only",
        action="store_true",
        help="Promote an existing user in user_profiles to admin without changing passwords",
    )

    args = parser.parse_args()

    try:
        asyncio.run(
            seed_admin(
                email=args.email,
                password=args.password,
                full_name=args.name,
                role=args.role,
                is_demo=args.demo,
                db_only=args.db_only,
                promote_only=args.promote_only,
            )
        )
    except KeyboardInterrupt:
        print("\n[!] Seeding aborted by user.")
        sys.exit(1)
    except Exception as exc:
        print(f"\n[X] Error seeding admin account: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
