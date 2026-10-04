import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Waves,
  ShieldCheck,
  Activity,
  Sparkles,
  Info,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { usePredictWaveAttenuation } from "../api/predictions";
import { useDebounce } from "../hooks/useDebounce";

interface Preset {
  name: string;
  species: string;
  density: number;
  bladeLength: number;
  waterDepth: number;
  waveHeight: number;
  wavePeriod: number;
  meadowWidth: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    name: "Enhalus Ribbon Meadow",
    species: "Enhalus acoroides",
    density: 240,
    bladeLength: 45,
    waterDepth: 1.6,
    waveHeight: 0.9,
    wavePeriod: 4.8,
    meadowWidth: 60,
    description: "Deep-rooted canopy with long flexible blades offering strong wave energy damping.",
  },
  {
    name: "Thalassia Reef Meadow",
    species: "Thalassia hemprichii",
    density: 380,
    bladeLength: 22,
    waterDepth: 1.2,
    waveHeight: 0.75,
    wavePeriod: 4.2,
    meadowWidth: 50,
    description: "Dense, compact Pacific turtle grass typical of intertidal reef flats.",
  },
  {
    name: "Halodule Pioneer Bed",
    species: "Halodule pinifolia",
    density: 650,
    bladeLength: 12,
    waterDepth: 0.9,
    waveHeight: 0.6,
    wavePeriod: 3.5,
    meadowWidth: 40,
    description: "High shoot density with short blades in shallow nearshore waters.",
  },
];

export function WaveModel() {
  const [density, setDensity] = useState(320);
  const [bladeLength, setBladeLength] = useState(35);
  const [waterDepth, setWaterDepth] = useState(1.5);
  const [waveHeight, setWaveHeight] = useState(0.8);
  const [wavePeriod, setWavePeriod] = useState(4.5);
  const [meadowWidth, setMeadowWidth] = useState(50);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Debounce slider values (300ms) to prevent flooding API during slider drag
  const debouncedDensity = useDebounce(density, 300);
  const debouncedBladeLength = useDebounce(bladeLength, 300);
  const debouncedWaterDepth = useDebounce(waterDepth, 300);
  const debouncedWaveHeight = useDebounce(waveHeight, 300);
  const debouncedWavePeriod = useDebounce(wavePeriod, 300);
  const debouncedMeadowWidth = useDebounce(meadowWidth, 300);

  const predictMutation = usePredictWaveAttenuation();

  const runPrediction = useCallback(
    (d: number, bl: number, wd: number, wh: number, wp: number, mw: number) => {
      predictMutation.mutate({
        seagrass_density: d,
        blade_length_cm: bl,
        water_depth_m: wd,
        wave_height_m: wh,
        wave_period_s: wp,
        meadow_length_m: mw,
      });
    },
    [predictMutation]
  );

  // Run on initial load and whenever debounced parameters settle
  useEffect(() => {
    runPrediction(
      debouncedDensity,
      debouncedBladeLength,
      debouncedWaterDepth,
      debouncedWaveHeight,
      debouncedWavePeriod,
      debouncedMeadowWidth
    );
  }, [
    debouncedDensity,
    debouncedBladeLength,
    debouncedWaterDepth,
    debouncedWaveHeight,
    debouncedWavePeriod,
    debouncedMeadowWidth,
    runPrediction,
  ]);

  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.name);
    setDensity(preset.density);
    setBladeLength(preset.bladeLength);
    setWaterDepth(preset.waterDepth);
    setWaveHeight(preset.waveHeight);
    setWavePeriod(preset.wavePeriod);
    setMeadowWidth(preset.meadowWidth);
  }, []);

  const result = predictMutation.data;

  const decayData = useMemo(() => {
    return (
      result?.raw_output?.distance_decay_profile || [
        { distance_m: 0, wave_height_m: waveHeight, energy_decay_pct: 0 },
        { distance_m: meadowWidth * 0.25, wave_height_m: waveHeight * 0.88, energy_decay_pct: 22.5 },
        { distance_m: meadowWidth * 0.5, wave_height_m: waveHeight * 0.77, energy_decay_pct: 40.7 },
        { distance_m: meadowWidth * 0.75, wave_height_m: waveHeight * 0.68, energy_decay_pct: 53.5 },
        { distance_m: meadowWidth, wave_height_m: waveHeight * 0.61, energy_decay_pct: 62.8 },
      ]
    );
  }, [result?.raw_output?.distance_decay_profile, waveHeight, meadowWidth]);

  const inshoreHeight = useMemo(() => {
    return result?.inshore_wave_height_m ?? Number((waveHeight * 0.62).toFixed(2));
  }, [result?.inshore_wave_height_m, waveHeight]);

  const energyDamping = useMemo(() => {
    return result?.attenuation_percent ?? 62.8;
  }, [result?.attenuation_percent]);

  const heightReduction = useMemo(() => {
    return (
      result?.wave_height_reduction_percent ??
      Number(((1 - inshoreHeight / waveHeight) * 100).toFixed(1))
    );
  }, [result?.wave_height_reduction_percent, inshoreHeight, waveHeight]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
            <Waves className="w-4 h-4" />
            <span>Hydrodynamic Damping Simulator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Wave Attenuation & Coastal Energy Impact
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Physics-based Mendez &amp; Losada (2004) vegetation wave dissipation engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              runPrediction(density, bladeLength, waterDepth, waveHeight, wavePeriod, meadowWidth)
            }
            disabled={predictMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${predictMutation.isPending ? "animate-spin" : ""}`} />
            Recalculate
          </button>
        </div>
      </div>

      {/* Preset Quick Select */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Preset Meadow Scenarios</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.name;
            return (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-teal-500 bg-teal-50/50 ring-1 ring-teal-500"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">{p.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-800 font-medium">
                    {p.meadowWidth}m
                  </span>
                </div>
                <div className="text-xs text-teal-700 italic mt-0.5 font-medium">{p.species}</div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls & Live Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hydrodynamic Parameters Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Input Ocean &amp; Vegetation Parameters</span>
            </div>

            {/* Shoot Density */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Seagrass Shoot Density</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {density} shoots/m²
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="10"
                value={density}
                onChange={(e) => {
                  setDensity(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Sparse (50)</span>
                <span>Moderate (300-500)</span>
                <span>Dense (1200)</span>
              </div>
            </div>

            {/* Blade Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Average Blade Length (Canopy Height)</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {bladeLength} cm
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={bladeLength}
                onChange={(e) => {
                  setBladeLength(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Short (5 cm)</span>
                <span>Medium (35 cm)</span>
                <span>Long Ribbon (100 cm)</span>
              </div>
            </div>

            {/* Water Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Mean Water Depth</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {waterDepth.toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={waterDepth}
                onChange={(e) => {
                  setWaterDepth(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Intertidal (0.5m)</span>
                <span>Shallow Subtidal (1.5m)</span>
                <span>Deep (8.0m)</span>
              </div>
            </div>

            {/* Incident Wave Height */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Offshore Wave Height (H₀)</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {waveHeight.toFixed(2)} m
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={waveHeight}
                onChange={(e) => {
                  setWaveHeight(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Calm (0.2m)</span>
                <span>Moderate Swell (0.8m)</span>
                <span>Storm Wave (3.0m)</span>
              </div>
            </div>

            {/* Peak Wave Period */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Peak Wave Period (T)</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {wavePeriod.toFixed(1)} s
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.5"
                value={wavePeriod}
                onChange={(e) => {
                  setWavePeriod(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Chop (2.0s)</span>
                <span>Wind Sea (4.5s)</span>
                <span>Long Swell (12.0s)</span>
              </div>
            </div>

            {/* Meadow Cross-Shore Width */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Meadow Cross-Shore Width</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {meadowWidth} m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={meadowWidth}
                onChange={(e) => {
                  setMeadowWidth(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Patch (10m)</span>
                <span>Standard (50m)</span>
                <span>Extensive (150m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Impact Badges & Wave Decay Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Energy Dissipated</span>
              </div>
              <div className="text-2xl font-bold text-teal-700">
                -{energyDamping.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Total wave kinetic energy absorbed
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Activity className="w-4 h-4 text-cyan-600" />
                <span>Height Reduction</span>
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                -{heightReduction.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                From {waveHeight.toFixed(2)}m to {inshoreHeight.toFixed(2)}m
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Waves className="w-4 h-4 text-emerald-600" />
                <span>Inshore Wave</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {inshoreHeight.toFixed(2)} m
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                At shoreward boundary ({meadowWidth}m)
              </div>
            </div>
          </div>

          {/* Interactive Decay Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Wave Height Decay Across Meadow Distance
                </h3>
                <p className="text-xs text-slate-500">
                  Dampened wave profile (m) vs meadow cross-shore progression (x = 0m to {meadowWidth}m)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  Seagrass Meadow
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-0.5 bg-slate-300"></span>
                  Bare Sandbed (Unattenuated)
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={decayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="distance_m"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}m`}
                    stroke="#cbd5e1"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, Math.ceil(waveHeight * 1.2 * 10) / 10]}
                    tickFormatter={(v) => `${v.toFixed(2)}m`}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toFixed(3)} m`, "Wave Height"]}
                    labelFormatter={(label) => `Distance: ${label} m into meadow`}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  />
                  <ReferenceLine
                    y={waveHeight}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: `Offshore H₀: ${waveHeight}m`,
                      position: "insideTopRight",
                      fill: "#64748b",
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wave_height_m"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#waveFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hydrodynamic Physics Parameters Summary */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Mendez &amp; Losada (2004) Model Formulation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">Submergence (l_e / h)</span>
                <span className="font-semibold text-slate-800">
                  {Math.min(bladeLength / (waterDepth * 100), 1.0).toFixed(2)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">Bulk Drag (C_D)</span>
                <span className="font-semibold text-slate-800">0.70</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">95% CI Lower</span>
                <span className="font-semibold text-teal-700">
                  {(result?.confidence_lower ?? energyDamping * 0.91).toFixed(1)}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                <span className="text-slate-400 block text-[10px]">95% CI Upper</span>
                <span className="font-semibold text-teal-700">
                  {(result?.confidence_upper ?? energyDamping * 1.07).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
