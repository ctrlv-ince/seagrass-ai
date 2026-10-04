"""GeoJSON and PostGIS spatial query endpoints.

Returns RFC 7946 compliant GeoJSON FeatureCollections for survey sites,
transect lines, and quadrat observation points.
"""

from __future__ import annotations

import json
import uuid
from typing import Any

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.seagrass import Quadrat, Species, Transect
from app.models.survey import Survey
from app.services.cache import response_cache

router = APIRouter()


@router.get("/surveys/geojson")
async def surveys_geojson(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Return all surveys with center locations as a GeoJSON FeatureCollection."""
    cache_key = "map:surveys:geojson"
    cached = response_cache.get(cache_key)
    if cached is not None:
        return cached
    query = (
        select(
            Survey.id,
            Survey.title,
            Survey.description,
            Survey.surveyor_name,
            Survey.location_name,
            Survey.status,
            Survey.created_at,
            func.ST_AsGeoJSON(Survey.center_point).label("geojson"),
        )
        .where(Survey.center_point.isnot(None))
        .order_by(Survey.created_at.desc())
    )

    result = await db.execute(query)
    rows = result.all()

    features = []
    for row in rows:
        if not row.geojson:
            continue
        geom = json.loads(row.geojson)
        features.append({
            "type": "Feature",
            "id": str(row.id),
            "geometry": geom,
            "properties": {
                "id": str(row.id),
                "title": row.title,
                "description": row.description,
                "surveyor_name": row.surveyor_name,
                "location_name": row.location_name,
                "status": row.status,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            },
        })

    result_data = {
        "type": "FeatureCollection",
        "features": features,
    }
    response_cache.set(cache_key, result_data, ttl=300)
    return result_data


@router.get("/transects/geojson")
async def transects_geojson(
    survey_id: uuid.UUID | None = Query(None, description="Filter by survey ID"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Return transects as a GeoJSON FeatureCollection with LineString geometries."""
    cache_key = f"map:transects:geojson:{survey_id or 'all'}"
    cached = response_cache.get(cache_key)
    if cached is not None:
        return cached

    query = select(
        Transect.id,
        Transect.survey_id,
        Transect.name,
        Transect.created_at,
        func.ST_AsGeoJSON(Transect.geometry).label("geojson"),
    )
    if survey_id is not None:
        query = query.where(Transect.survey_id == survey_id)

    query = query.order_by(Transect.created_at.desc())
    result = await db.execute(query)
    rows = result.all()

    features = []
    for row in rows:
        if not row.geojson:
            continue
        geom = json.loads(row.geojson)
        features.append({
            "type": "Feature",
            "id": str(row.id),
            "geometry": geom,
            "properties": {
                "id": str(row.id),
                "survey_id": str(row.survey_id),
                "name": row.name,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            },
        })

    result_data = {
        "type": "FeatureCollection",
        "features": features,
    }
    response_cache.set(cache_key, result_data, ttl=300)
    return result_data


@router.get("/quadrats/geojson")
async def quadrats_geojson(
    survey_id: uuid.UUID | None = Query(None, description="Filter by survey ID"),
    transect_id: uuid.UUID | None = Query(None, description="Filter by transect ID"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Return quadrats as a GeoJSON FeatureCollection with Point geometries."""
    cache_key = f"map:quadrats:geojson:{survey_id or 'none'}:{transect_id or 'none'}"
    cached = response_cache.get(cache_key)
    if cached is not None:
        return cached

    query = (
        select(
            Quadrat.id,
            Quadrat.transect_id,
            Quadrat.position_along_transect,
            Quadrat.coverage_percent,
            Species.scientific_name.label("species_name"),
            Species.common_name.label("species_common_name"),
            func.ST_AsGeoJSON(Quadrat.location).label("geojson"),
        )
        .outerjoin(Species, Quadrat.species_id == Species.id)
    )

    if transect_id is not None:
        query = query.where(Quadrat.transect_id == transect_id)
    elif survey_id is not None:
        query = query.join(Transect, Quadrat.transect_id == Transect.id).where(Transect.survey_id == survey_id)

    result = await db.execute(query)
    rows = result.all()

    features = []
    for row in rows:
        if not row.geojson:
            continue
        geom = json.loads(row.geojson)
        features.append({
            "type": "Feature",
            "id": str(row.id),
            "geometry": geom,
            "properties": {
                "id": str(row.id),
                "transect_id": str(row.transect_id),
                "position_along_transect": row.position_along_transect,
                "coverage_percent": row.coverage_percent,
                "species_name": row.species_name,
                "species_common_name": row.species_common_name,
            },
        })

    result_data = {
        "type": "FeatureCollection",
        "features": features,
    }
    response_cache.set(cache_key, result_data, ttl=300)
    return result_data
