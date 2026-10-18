
export interface WaveReportProps {
  scenarioName: string;
  parameters: {
    density: number;
    bladeLength: number;
    waterDepth: number;
    waveHeight: number;
    wavePeriod: number;
    meadowWidth: number;
  };
  results: {
    inshoreHeight: number;
    heightReduction: number;
    energyDamping: number;
  };
  decayProfile: Array<{
    distance_m: number;
    wave_height_m: number;
    energy_decay_pct?: number;
  }>;
}

export function WaveReport({
  scenarioName,
  parameters,
  results,
  decayProfile,
}: WaveReportProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans print:p-0 print:bg-white print:text-slate-900">
      {/* Document Header */}
      <div className="border-b-2 border-teal-800 dark:border-teal-500 pb-4 mb-6 flex justify-between items-start">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-800 dark:text-teal-400 font-bold">
            Seagrass AI — Marine Hydrodynamics &amp; Coastal Telemetry
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Wave Attenuation &amp; Energy Dissipation Assessment
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Physics-based Mendez &amp; Losada (2004) vegetation damping simulation
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
          <div>Report Date: {currentDate}</div>
          <div className="font-semibold text-teal-700 dark:text-teal-400 mt-1">Scenario: {scenarioName}</div>
        </div>
      </div>

      {/* Executive Summary Metrics */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          1. Key Coastal Protection Findings
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Energy Dissipated</div>
            <div className="text-2xl font-bold text-teal-800 dark:text-teal-400 mt-1">
              -{results.energyDamping.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Wave kinetic energy absorbed by canopy
            </div>
          </div>
          <div className="p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wave Height Reduction</div>
            <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-400 mt-1">
              -{results.heightReduction.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              From {parameters.waveHeight.toFixed(2)}m to {results.inshoreHeight.toFixed(2)}m
            </div>
          </div>
          <div className="p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transmitted Inshore Wave</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {results.inshoreHeight.toFixed(2)} m
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              At shoreward boundary ({parameters.meadowWidth}m)
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Input Parameters */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          2. Field &amp; Hydrodynamic Parameters
        </h2>
        <table className="w-full text-xs border border-slate-300 dark:border-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-left">
              <th className="p-2.5 border border-slate-300 dark:border-slate-700 font-semibold">Parameter</th>
              <th className="p-2.5 border border-slate-300 dark:border-slate-700 font-semibold">Symbol</th>
              <th className="p-2.5 border border-slate-300 dark:border-slate-700 font-semibold">Value</th>
              <th className="p-2.5 border border-slate-300 dark:border-slate-700 font-semibold">Unit</th>
              <th className="p-2.5 border border-slate-300 dark:border-slate-700 font-semibold">Field Context</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Seagrass Shoot Density</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">N</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.density}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">shoots / m²</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Canopy spatial concentration</td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Average Blade Length</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">l_v</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.bladeLength}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">cm</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Mean vegetative canopy height</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Ambient Water Depth</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">h</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.waterDepth.toFixed(1)}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">m</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Mean high/low water column</td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Offshore Incident Wave Height</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">H_0</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.waveHeight.toFixed(2)}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">m</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Seaward boundary wave amplitude</td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Peak Wave Period</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">T_p</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.wavePeriod.toFixed(1)}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">s</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Offshore swell/chop wave frequency</td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-medium">Meadow Cross-Shore Width</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">b</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{parameters.meadowWidth}</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700">m</td>
              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">Continuous vegetation transect distance</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Distance Decay Profile */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          3. Cross-Shore Wave Height Decay Profile
        </h2>
        <table className="w-full text-xs border border-slate-300 dark:border-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-left">
              <th className="p-2 border border-slate-300 dark:border-slate-700 font-semibold">Transect Distance (m)</th>
              <th className="p-2 border border-slate-300 dark:border-slate-700 font-semibold">Dampened Wave Height (m)</th>
              <th className="p-2 border border-slate-300 dark:border-slate-700 font-semibold">Cumulative Energy Attenuation (%)</th>
            </tr>
          </thead>
          <tbody>
            {decayProfile.map((pt, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono">{pt.distance_m} m</td>
                <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono font-bold">
                  {pt.wave_height_m.toFixed(3)} m
                </td>
                <td className="p-2 border border-slate-300 dark:border-slate-700 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  {pt.energy_decay_pct !== undefined ? `${pt.energy_decay_pct.toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodological Reference & Citation */}
      <div className="pt-4 border-t border-slate-300 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <div className="font-semibold text-slate-700 dark:text-slate-300">Methodology &amp; Scientific Reference:</div>
        <div>
          Mendez, F. J., &amp; Losada, I. J. (2004). An empirical model to estimate wave energy dissipation
          over vegetation fields. <em>Coastal Engineering</em>, 51(8-9), 767-783.
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500">
          Generated automatically by Seagrass AI Hydrodynamic Simulation Suite. For coastal defense planning purposes only.
        </div>
      </div>
    </div>
  );
}
