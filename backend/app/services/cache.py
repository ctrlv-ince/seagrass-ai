"""In-memory TTL cache service for server-side response caching.

Thread-safe dictionary cache with per-key TTL and max entry eviction.
Designed for single-instance deployments; swap to Redis for multi-instance.
"""

from __future__ import annotations

import time
import threading
from typing import Any

from app.config import settings


class MemoryCache:
    """Simple in-memory cache with TTL eviction and max-entry bounds."""

    def __init__(self, max_entries: int | None = None) -> None:
        self._store: dict[str, tuple[Any, float]] = {}
        self._lock = threading.Lock()
        self._max_entries = max_entries or settings.cache_max_entries

    def get(self, key: str) -> Any | None:
        """Retrieve a cached value if it exists and hasn't expired."""
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, expires_at = entry
            if time.monotonic() > expires_at:
                del self._store[key]
                return None
            return value

    def set(self, key: str, value: Any, ttl: int) -> None:
        """Store a value with a TTL in seconds."""
        with self._lock:
            # Evict expired entries if at capacity
            if len(self._store) >= self._max_entries:
                self._evict_expired()
            # If still at capacity, evict oldest entry
            if len(self._store) >= self._max_entries:
                oldest_key = min(
                    self._store, key=lambda k: self._store[k][1]
                )
                del self._store[oldest_key]

            self._store[key] = (value, time.monotonic() + ttl)

    def invalidate(self, prefix: str = "") -> int:
        """Remove all entries whose keys start with the given prefix.

        If prefix is empty, clears the entire cache.
        Returns the number of entries removed.
        """
        with self._lock:
            if not prefix:
                count = len(self._store)
                self._store.clear()
                return count
            keys_to_delete = [k for k in self._store if k.startswith(prefix)]
            for k in keys_to_delete:
                del self._store[k]
            return len(keys_to_delete)

    def _evict_expired(self) -> None:
        """Remove all expired entries (caller must hold the lock)."""
        now = time.monotonic()
        expired = [k for k, (_, exp) in self._store.items() if now > exp]
        for k in expired:
            del self._store[k]

    @property
    def size(self) -> int:
        """Current number of cached entries."""
        return len(self._store)


# Module-level singleton
response_cache = MemoryCache()
