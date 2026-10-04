"""Wave attenuation regression and hydrodynamic physics service.

Implements coastal hydrodynamic vegetation damping equations (Mendez & Losada 2004,
Dalrymple et al. 1984) to model incident wave height reduction and kinetic energy
dissipation through seagrass meadow canopies.
"""

from __future__ import annotations

import math
from typing import Any

GRAVITY = 9.80665  # m/s^2
DEFAULT_BLADE_WIDTH_M = 0.01  # 1 cm mean blade width
DEFAULT_DRAG_COEFFICIENT = 0.70  # Bulk drag coefficient for flexible seagrass
DEFAULT_MEADOW_TRANSECT_LENGTH_M = 50.0  # Standard evaluation distance in meters


def solve_wavenumber(angular_freq: float, water_depth: float, max_iter: int = 15) -> float:
    """Solve the linear wave dispersion relation for wavenumber k:
    omega^2 = g * k * tanh(k * h).

    Uses Newton-Raphson iteration with shallow/deep water seed bounds.
    """
    omega = angular_freq
    h = max(water_depth, 0.05)
    g = GRAVITY

    # Initial guess: deep water approximation k0 = omega^2 / g
    k = omega * omega / g
    # Adjust for shallow water if omega^2 * h / g < 1
    if (omega * omega * h / g) < 1.0:
        k = omega / math.sqrt(g * h)

    for _ in range(max_iter):
        kh = k * h
        tanh_kh = math.tanh(min(kh, 50.0))
        # f(k) = g * k * tanh(kh) - omega^2
        f = g * k * tanh_kh - omega * omega
        # df/dk = g * tanh(kh) + g * k * h * (1 - tanh(kh)^2)
        df = g * tanh_kh + g * kh * (1.0 - tanh_kh * tanh_kh)

        if abs(df) < 1e-12:
            break

        step = f / df
        k -= step
        if abs(step) < 1e-7:
            break

    return max(k, 1e-5)


class WaveAttenuationModel:
    """Hydrodynamic wave attenuation model for coastal seagrass meadows."""

    def __init__(self, model_version: str = "v2.1-hydro-physics") -> None:
        self.model_version = model_version

    async def predict(
        self,
        seagrass_density: float,
        blade_length_cm: float,
        water_depth_m: float,
        wave_height_m: float,
        wave_period_s: float,
        meadow_length_m: float = DEFAULT_MEADOW_TRANSECT_LENGTH_M,
    ) -> dict[str, Any]:
        """Predict wave attenuation and energy dissipation through seagrass canopy.

        Args:
            seagrass_density: Shoot density (shoots/m²), e.g. 100 - 1500.
            blade_length_cm: Average blade length / canopy height in cm, e.g. 10 - 100.
            water_depth_m: Water depth in meters, e.g. 0.5 - 15.0.
            wave_height_m: Incident significant wave height H0 in meters, e.g. 0.2 - 3.5.
            wave_period_s: Peak wave period T in seconds, e.g. 3.0 - 14.0.
            meadow_length_m: Width of seagrass meadow in propagation direction (default: 50m).

        Returns:
            Dict containing:
                - attenuation_percent: Wave energy reduction percentage [0-100%]
                - wave_height_reduction_percent: Wave height reduction percentage [0-100%]
                - inshore_wave_height_m: Dampened wave height after passing through meadow
                - confidence_lower: Lower bound of attenuation percentage
                - confidence_upper: Upper bound of attenuation percentage
                - raw_output: Diagnostics dictionary with distance decay profile
        """
        # Physical parameter sanitization
        N = max(seagrass_density, 1.0)
        h_v = max(blade_length_cm / 100.0, 0.01)  # Canopy height in meters
        h = max(water_depth_m, 0.1)  # Water depth in meters
        H0 = max(wave_height_m, 0.05)  # Incident wave height in meters
        T = max(wave_period_s, 1.0)  # Wave period in seconds
        W = max(meadow_length_m, 5.0)

        omega = 2.0 * math.pi / T
        k = solve_wavenumber(omega, h)
        wavelength = 2.0 * math.pi / k

        # Effective canopy height submerged in water column
        l_e = min(h_v, h)
        submergence_ratio = l_e / h

        # Damping calculation helper for given drag coefficient C_D
        def compute_decay(cd: float) -> tuple[float, float, float]:
            kl_e = k * l_e
            kh = k * h

            # Numerator: sinh^3(k * l_e) + 3 * sinh(k * l_e)
            sinh_kle = math.sinh(min(kl_e, 50.0))
            numerator = (sinh_kle ** 3) + 3.0 * sinh_kle

            # Denominator: (sinh(2 * k * h) + 2 * k * h) * sinh(k * h)
            sinh_2kh = math.sinh(min(2.0 * kh, 50.0))
            sinh_kh = math.sinh(min(kh, 50.0))
            denominator = (sinh_2kh + 2.0 * kh) * sinh_kh

            if denominator <= 0:
                return 0.0, H0, 0.0

            # Mendez & Losada damping coefficient:
            # k_d = (4 / (9 * pi)) * C_D * b_v * N * k * (numerator / denominator)
            kd = (4.0 / (9.0 * math.pi)) * cd * DEFAULT_BLADE_WIDTH_M * N * k * (numerator / denominator)

            # Wave height at distance x: H(x) = H0 / (1 + kd * H0 * x)
            beta = kd * H0
            H_w = H0 / (1.0 + beta * W)
            H_w = max(min(H_w, H0), 0.001)

            # Energy is proportional to H^2
            energy_attenuation_pct = (1.0 - (H_w * H_w) / (H0 * H0)) * 100.0
            height_reduction_pct = (1.0 - (H_w / H0)) * 100.0

            return max(min(energy_attenuation_pct, 99.5), 0.0), H_w, height_reduction_pct

        # Nominal prediction
        nom_attenuation, inshore_H, nom_height_red = compute_decay(DEFAULT_DRAG_COEFFICIENT)

        # Confidence intervals based on hydrodynamic drag variability (±20% Cd)
        lower_bound_atten, _, _ = compute_decay(DEFAULT_DRAG_COEFFICIENT * 0.80)
        upper_bound_atten, _, _ = compute_decay(DEFAULT_DRAG_COEFFICIENT * 1.20)

        # Wave height profile along meadow transect distances
        profile_distances = [0.0, 10.0, 25.0, 50.0, 75.0, 100.0, 150.0, 200.0]
        decay_profile = []
        kd_nominal = (4.0 / (9.0 * math.pi)) * DEFAULT_DRAG_COEFFICIENT * DEFAULT_BLADE_WIDTH_M * N * k * (
            ((math.sinh(min(k * l_e, 50.0)) ** 3) + 3.0 * math.sinh(min(k * l_e, 50.0)))
            / ((math.sinh(min(2.0 * k * h, 50.0)) + 2.0 * k * h) * math.sinh(min(k * h, 50.0)))
        )
        beta_nom = kd_nominal * H0

        for dist in profile_distances:
            h_dist = H0 / (1.0 + beta_nom * dist)
            h_dist_unprotected = H0 * math.exp(-0.0005 * dist)  # Slight baseline bottom friction
            energy_loss = (1.0 - (h_dist * h_dist) / (H0 * H0)) * 100.0
            decay_profile.append({
                "distance_m": dist,
                "wave_height_with_seagrass_m": round(h_dist, 3),
                "wave_height_unprotected_m": round(h_dist_unprotected, 3),
                "energy_dissipated_percent": round(energy_loss, 2),
            })

        return {
            "attenuation_percent": round(nom_attenuation, 2),
            "wave_height_reduction_percent": round(nom_height_red, 2),
            "inshore_wave_height_m": round(inshore_H, 3),
            "confidence_lower": round(min(lower_bound_atten, nom_attenuation), 2),
            "confidence_upper": round(max(upper_bound_atten, nom_attenuation), 2),
            "model_version": self.model_version,
            "raw_output": {
                "wavenumber_k": round(k, 5),
                "wavelength_m": round(wavelength, 2),
                "canopy_height_m": round(h_v, 3),
                "submergence_ratio": round(submergence_ratio, 3),
                "damping_factor_beta": round(beta_nom, 6),
                "transect_profile": decay_profile,
            },
        }
