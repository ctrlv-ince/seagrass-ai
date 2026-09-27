"""GeoJSON helpers and coordinate transforms."""

from __future__ import annotations

from typing import Any


def point_to_geojson(latitude: float, longitude: float) -> dict[str, Any]:
    """Convert lat/lng to a GeoJSON Point geometry.

    Args:
        latitude: Latitude in decimal degrees.
        longitude: Longitude in decimal degrees.

    Returns:
        GeoJSON Point geometry dict.
    """
    return {
        "type": "Point",
        "coordinates": [longitude, latitude],  # GeoJSON is [lng, lat]
    }


def feature_collection(features: list[dict[str, Any]]) -> dict[str, Any]:
    """Wrap a list of GeoJSON features in a FeatureCollection.

    Args:
        features: List of GeoJSON Feature dicts.

    Returns:
        GeoJSON FeatureCollection dict.
    """
    return {
        "type": "FeatureCollection",
        "features": features,
    }


def wkt_point(latitude: float, longitude: float) -> str:
    """Convert lat/lng to WKT POINT string.

    Args:
        latitude: Latitude in decimal degrees.
        longitude: Longitude in decimal degrees.

    Returns:
        WKT string, e.g. "POINT(120.5 14.5)".
    """
    return f"POINT({longitude} {latitude})"
