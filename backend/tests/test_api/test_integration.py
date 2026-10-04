"""Integration tests for Seagrass backend API endpoints."""

from __future__ import annotations

import io
import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image

from app.main import create_app


@pytest.fixture
def app():
    return create_app()


@pytest.mark.asyncio
async def test_health_endpoint(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_species_catalogue(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/detections/species")
        assert res.status_code == 200
        species = res.json()
        assert isinstance(species, list)
        assert len(species) >= 5
        names = [s["scientific_name"] for s in species]
        assert "Enhalus acoroides" in names
        assert "Thalassia hemprichii" in names


@pytest.mark.asyncio
async def test_detection_analyze_endpoint(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create test green image
        img = Image.new("RGB", (320, 240), color=(34, 139, 34))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        image_bytes = buf.getvalue()

        files = {"file": ("quadrat_test.jpg", image_bytes, "image/jpeg")}
        res = await client.post(
            "/api/v1/detections/analyze",
            files=files,
            params={
                "water_depth_m": 1.2,
                "incident_wave_height_m": 0.75,
                "wave_period_s": 4.0,
                "meadow_width_m": 40.0,
            },
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert "specifications" in data
        assert "wave_attenuation" in data
        assert data["wave_attenuation"]["wave_energy_damping_pct"] > 0
        assert data["wave_attenuation"]["transmitted_wave_height_m"] < 0.75
        assert len(data["detections"]) > 0


@pytest.mark.asyncio
async def test_surveys_geojson_endpoint(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/maps/surveys/geojson")
        assert res.status_code == 200
        data = res.json()
        assert data["type"] == "FeatureCollection"
        assert isinstance(data["features"], list)
