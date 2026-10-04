"""Unit tests for the hydrodynamic wave attenuation model."""

import pytest
import math
from app.services.wave_model import WaveAttenuationModel, solve_wavenumber


def test_dispersion_wavenumber_solver():
    """Verify dispersion relation solver against known analytical benchmarks."""
    # Deep water check: L0 = (g * T^2) / (2 * pi)
    period = 10.0
    omega = 2.0 * math.pi / period
    deep_depth = 500.0
    k_deep = solve_wavenumber(omega, deep_depth)
    expected_k_deep = (omega ** 2) / 9.80665
    assert math.isclose(k_deep, expected_k_deep, rel_tol=1e-3)

    # Shallow water check: c = sqrt(g * h), k = omega / sqrt(g * h)
    shallow_depth = 1.0
    k_shallow = solve_wavenumber(omega, shallow_depth)
    expected_k_shallow = omega / math.sqrt(9.80665 * shallow_depth)
    assert math.isclose(k_shallow, expected_k_shallow, rel_tol=0.05)


@pytest.mark.asyncio
async def test_wave_attenuation_density_sensitivity():
    """Higher seagrass shoot density must produce greater wave attenuation."""
    model = WaveAttenuationModel()

    sparse_meadow = await model.predict(
        seagrass_density=100.0,
        blade_length_cm=30.0,
        water_depth_m=1.8,
        wave_height_m=1.5,
        wave_period_s=6.0,
    )

    dense_meadow = await model.predict(
        seagrass_density=800.0,
        blade_length_cm=30.0,
        water_depth_m=1.8,
        wave_height_m=1.5,
        wave_period_s=6.0,
    )

    assert dense_meadow["attenuation_percent"] > sparse_meadow["attenuation_percent"]
    assert dense_meadow["inshore_wave_height_m"] < sparse_meadow["inshore_wave_height_m"]


@pytest.mark.asyncio
async def test_wave_attenuation_blade_length_sensitivity():
    """Longer seagrass blades occupy more of the water column and damp more wave energy."""
    model = WaveAttenuationModel()

    short_canopy = await model.predict(
        seagrass_density=400.0,
        blade_length_cm=15.0,
        water_depth_m=1.8,
        wave_height_m=1.5,
        wave_period_s=6.0,
    )

    tall_canopy = await model.predict(
        seagrass_density=400.0,
        blade_length_cm=60.0,
        water_depth_m=1.8,
        wave_height_m=1.5,
        wave_period_s=6.0,
    )

    assert tall_canopy["attenuation_percent"] > short_canopy["attenuation_percent"]


@pytest.mark.asyncio
async def test_wave_attenuation_depth_effect():
    """Deeper water reduces relative canopy occupation, reducing attenuation percentage."""
    model = WaveAttenuationModel()

    shallow = await model.predict(
        seagrass_density=400.0,
        blade_length_cm=30.0,
        water_depth_m=1.0,
        wave_height_m=1.0,
        wave_period_s=5.0,
    )

    deep = await model.predict(
        seagrass_density=400.0,
        blade_length_cm=30.0,
        water_depth_m=6.0,
        wave_height_m=1.0,
        wave_period_s=5.0,
    )

    assert shallow["attenuation_percent"] > deep["attenuation_percent"]


@pytest.mark.asyncio
async def test_wave_attenuation_confidence_and_profile():
    """Check that confidence bounds bracket nominal prediction and profile decays with distance."""
    model = WaveAttenuationModel()

    res = await model.predict(
        seagrass_density=450.0,
        blade_length_cm=28.0,
        water_depth_m=1.8,
        wave_height_m=1.6,
        wave_period_s=6.5,
    )

    assert 0.0 <= res["confidence_lower"] <= res["attenuation_percent"] <= res["confidence_upper"] <= 100.0
    assert "raw_output" in res
    profile = res["raw_output"]["transect_profile"]
    assert len(profile) >= 5

    # Check monotonic height decay along transect distance
    heights = [p["wave_height_with_seagrass_m"] for p in profile]
    for i in range(len(heights) - 1):
        assert heights[i] >= heights[i + 1]
