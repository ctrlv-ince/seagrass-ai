"""Prediction endpoint tests."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_predict_wave_attenuation_endpoint(client: AsyncClient) -> None:
    """Verify that posting meadow parameters returns calculated attenuation and persists to database."""
    payload = {
        "seagrass_density": 500.0,
        "blade_length_cm": 35.0,
        "water_depth_m": 1.8,
        "wave_height_m": 1.6,
        "wave_period_s": 6.5,
    }

    response = await client.post("/api/v1/predictions/wave-attenuation", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert "id" in data
    assert data["seagrass_density"] == 500.0
    assert data["blade_length_cm"] == 35.0
    assert data["water_depth_m"] == 1.8
    assert data["wave_height_m"] == 1.6
    assert data["wave_period_s"] == 6.5
    assert data["attenuation_percent"] > 0
    assert data["confidence_lower"] is not None
    assert data["confidence_upper"] is not None
    assert "transect_profile" in data["raw_output"]

    # Test retrieval by ID
    pred_id = data["id"]
    get_res = await client.get(f"/api/v1/predictions/wave-attenuation/{pred_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["id"] == pred_id
    assert retrieved["attenuation_percent"] == data["attenuation_percent"]
