"""YOLOv11 model loading and inference service.

Handles model lifecycle, image preprocessing, and detection result parsing.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from app.config import settings


class YOLOService:
    """Manages YOLOv11 model loading and inference.

    Usage via FastAPI dependency injection::

        async def get_yolo() -> YOLOService:
            return YOLOService(settings.yolo_model_path)
    """

    def __init__(self, model_path: str | None = None) -> None:
        self._model_path = Path(model_path or settings.yolo_model_path)
        self._model: Any = None

    def load_model(self) -> None:
        """Load the YOLOv11 model from disk.

        TODO: Implement with ultralytics YOLO() once model is available.
        """
        if not self._model_path.exists():
            raise FileNotFoundError(
                f"YOLO model not found at {self._model_path}. "
                "Download or train a model first."
            )

    async def detect(self, image_bytes: bytes) -> dict[str, Any]:
        """Run inference on an image.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG).

        Returns:
            Detection results with bounding boxes, classes, and confidences.

        TODO: Implement inference pipeline.
        """
        raise NotImplementedError("YOLO inference not yet implemented")
