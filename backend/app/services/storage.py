"""S3/MinIO file storage service.

Handles image uploads, downloads, and presigned URL generation.
"""

from __future__ import annotations

from typing import Any

import boto3
from botocore.config import Config

from app.config import settings


class StorageService:
    """S3-compatible object storage client.

    Usage via FastAPI dependency injection::

        async def get_storage() -> StorageService:
            return StorageService()
    """

    def __init__(self) -> None:
        self._client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            config=Config(signature_version="s3v4"),
        )
        self._bucket = settings.s3_bucket_name

    async def upload_image(
        self,
        key: str,
        data: bytes,
        content_type: str = "image/jpeg",
    ) -> str:
        """Upload an image to S3.

        Args:
            key: Object key (path in bucket).
            data: Raw file bytes.
            content_type: MIME type.

        Returns:
            The S3 key of the uploaded object.
        """
        self._client.put_object(
            Bucket=self._bucket,
            Key=key,
            Body=data,
            ContentType=content_type,
        )
        return key

    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for downloading an object.

        Args:
            key: Object key.
            expires_in: URL validity in seconds (default 1 hour).

        Returns:
            Presigned download URL.
        """
        url: str = self._client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self._bucket, "Key": key},
            ExpiresIn=expires_in,
        )
        return url

    async def delete_object(self, key: str) -> None:
        """Delete an object from S3."""
        self._client.delete_object(Bucket=self._bucket, Key=key)
