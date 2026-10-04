/**
 * Mendez & Losada (2004) hydrodynamic vegetation damping solver.
 * Pure numerical physics computation for coastal wave attenuation.
 */
export function computeWaveDamping(
  density: number,
  bladeLengthCm: number,
  waterDepthM: number,
  incidentWaveHeightM: number,
  wavePeriodS = 4.5,
  meadowWidthM = 50.0
) {
  const g = 9.80665;
  const h = Math.max(waterDepthM, 0.1);
  const H0 = Math.max(incidentWaveHeightM, 0.05);
  const N = Math.max(density, 1.0);
  const hv = Math.max(bladeLengthCm / 100.0, 0.02);
  const cd = 0.70;
  const bv = 0.01; // 1 cm average blade width

  // Shallow-to-intermediate water dispersion approximation
  const omega = (2 * Math.PI) / wavePeriodS;
  let k = omega / Math.sqrt(g * h); // Shallow seed
  for (let i = 0; i < 8; i++) {
    const kh = k * h;
    const f = g * k * Math.tanh(Math.min(kh, 20)) - omega * omega;
    const df =
      g * Math.tanh(Math.min(kh, 20)) +
      g * kh * (1 - Math.pow(Math.tanh(Math.min(kh, 20)), 2));
    if (Math.abs(df) > 1e-9) k -= f / df;
  }
  k = Math.max(k, 0.01);

  const le = Math.min(hv, h);
  const sinhKle = Math.sinh(Math.min(k * le, 20));
  const sinh2Kh = Math.sinh(Math.min(2 * k * h, 40));
  const num = Math.pow(sinhKle, 3) + 3 * sinhKle;
  const den = sinh2Kh + 2 * k * h;
  const kd =
    ((4 * cd * bv * N) / (9 * Math.PI)) * k * (num / Math.max(den, 0.01));

  // Transmitted wave height after passing through meadow
  const Hw = H0 / (1.0 + kd * H0 * meadowWidthM);
  const heightReductionPct = Math.min(
    Math.max((1.0 - Hw / H0) * 100.0, 0.0),
    99.0
  );
  const energyDampingPct = Math.min(
    Math.max((1.0 - Math.pow(Hw / H0, 2)) * 100.0, 0.0),
    99.9
  );

  return {
    inshoreHeight: parseFloat(Hw.toFixed(2)),
    heightReductionPct: parseFloat(heightReductionPct.toFixed(1)),
    energyDampingPct: parseFloat(energyDampingPct.toFixed(1)),
  };
}
