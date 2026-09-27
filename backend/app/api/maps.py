"""GeoJSON and spatial query endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter()


@router.get("/surveys/geojson")
async def surveys_geojson(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Return all survey locations as a GeoJSON FeatureCollection.

    TODO: Implement spatial queries with PostGIS.
    """
    return {
        "type": "FeatureCollection",
        "features": [],
    }


@router.get("/transects/geojson")
async def transects_geojson(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Return all transects as a GeoJSON FeatureCollection.

    TODO: Implement spatial queries with PostGIS.
    """
    return {
        "type": "FeatureCollection",
        "features": [],
    }
