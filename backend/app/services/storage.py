"""Supabase / S3-compatible file storage service.

Handles image uploads, public URLs, and object management.
"""

from __future__ import annotations

import httpx
from botocore.config import Config
import boto3

from app.config import settings


class StorageService:
    """Storage client for Seagrass survey images.

    Prefers native Supabase Storage REST API when SUPABASE_URL and
    SUPABASE_SERVICE_KEY are present; falls back to standard S3 protocol.
    """

    def __init__(self) -> None:
        self.supabase_url = settings.supabase_url.rstrip("/")
        self.service_key = settings.supabase_service_key
        self.bucket = settings.s3_bucket_name or "seagrass-images"
        self._s3_client = None

        if settings.s3_access_key and settings.s3_secret_key:
            self._s3_client = boto3.client(
                "s3",
                endpoint_url=settings.s3_endpoint_url,
                aws_access_key_id=settings.s3_access_key,
                aws_secret_access_key=settings.s3_secret_key,
                config=Config(signature_version="s3v4"),
            )

    def get_public_url(self, key: str) -> str:
        """Return the public CDN URL for an image."""
        if self.supabase_url:
            cleaned_key = key.lstrip("/")
            return f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/{cleaned_key}"
        return f"/{self.bucket}/{key}"

    async def upload_image(
        self,
        key: str,
        data: bytes,
        content_type: str = "image/jpeg",
    ) -> str:
        """Upload an image to storage.

        Args:
            key: Object key (path in bucket, e.g. 'surveys/{id}/photo.jpg').
            data: Raw file bytes.
            content_type: MIME type.

        Returns:
            The public URL or storage key of the uploaded object.
        """
        cleaned_key = key.lstrip("/")

        # Prefer Supabase Storage REST API
        if self.supabase_url and self.service_key:
            url = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{cleaned_key}"
            headers = {
                "Authorization": f"Bearer {self.service_key}",
                "Content-Type": content_type,
                "x-upsert": "true",
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, headers=headers, content=data)
                resp.raise_for_status()
            return cleaned_key

        # Fallback to S3 client
        if self._s3_client:
            self._s3_client.put_object(
                Bucket=self.bucket,
                Key=cleaned_key,
                Body=data,
                ContentType=content_type,
            )
            return cleaned_key

        # Local/dev fallback
        return cleaned_key

    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """Generate a signed or public download URL for an object."""
        cleaned_key = key.lstrip("/")
        if self.supabase_url and self.service_key:
            url = f"{self.supabase_url}/storage/v1/object/sign/{self.bucket}/{cleaned_key}"
            headers = {
                "Authorization": f"Bearer {self.service_key}",
                "Content-Type": "application/json",
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, headers=headers, json={"expiresIn": expires_in})
                if resp.status_code == 200:
                    signed_path = resp.json().get("signedURL", "")
                    return f"{self.supabase_url}/storage/v1{signed_path}"

        return self.get_public_url(cleaned_key)

    async def delete_object(self, key: str) -> None:
        """Delete an object from storage."""
        cleaned_key = key.lstrip("/")
        if self.supabase_url and self.service_key:
            url = f"{self.supabase_url}/storage/v1/object/{self.bucket}"
            headers = {
                "Authorization": f"Bearer {self.service_key}",
                "Content-Type": "application/json",
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                await client.request(
                    "DELETE", url, headers=headers, json={"prefixes": [cleaned_key]}
                )
        elif self._s3_client:
            self._s3_client.delete_object(Bucket=self.bucket, Key=cleaned_key)


async def get_storage() -> StorageService:
    """Dependency injection provider for StorageService."""
    return StorageService()
