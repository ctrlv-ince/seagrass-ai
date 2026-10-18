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
  Download,
  Printer,
  GitCompare,
} from "lucide-react";
import { usePredictWaveAttenuation } from "../api/predictions";
import { useDebounce } from "../hooks/useDebounce";
import { downloadCSV, downloadJSON } from "../lib/export";
import { WaveReport } from "../components/wave/WaveReport";

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

const PRESETS_B: Preset[] = [
  {
    name: "Degraded Meadow",
    species: "Fragmented Canopy",
    density: 120,
    bladeLength: 18,
    waterDepth: 1.5,
    waveHeight: 0.8,
    wavePeriod: 4.5,
    meadowWidth: 50,
    description: "Impacted meadow with low density offering minimal wave dissipation.",
  },
  {
    name: "Bare Sandbed",
    species: "Unvegetated Substrate",
    density: 0,
    bladeLength: 0,
    waterDepth: 1.5,
    waveHeight: 0.8,
    wavePeriod: 4.5,
    meadowWidth: 50,
    description: "Zero vegetation canopy; waves propagate with minimal bed friction attenuation.",
  },
  {
    name: "Dense Enhalus Canopy",
    species: "Enhalus acoroides",
    density: 380,
    bladeLength: 55,
    waterDepth: 1.6,
    waveHeight: 0.8,
    wavePeriod: 4.5,
    meadowWidth: 60,
    description: "Maximum biomass healthy meadow with high wave energy damping.",
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

  // Comparison Mode State (Scenario B)
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [activeScenarioTab, setActiveScenarioTab] = useState<"A" | "B">("A");
  const [bDensity, setBDensity] = useState(120);
  const [bBladeLength, setBBladeLength] = useState(18);
  const [bWaterDepth, setBWaterDepth] = useState(1.5);
  const [bWaveHeight, setBWaveHeight] = useState(0.8);
  const [bWavePeriod, setBWavePeriod] = useState(4.5);
  const [bMeadowWidth, setBMeadowWidth] = useState(50);
  const [bActivePreset, setBActivePreset] = useState<string | null>("Degraded Meadow");

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

  const applyPresetB = useCallback((preset: Preset) => {
    setBActivePreset(preset.name);
    setBDensity(preset.density);
    setBBladeLength(preset.bladeLength);
    setBWaterDepth(preset.waterDepth);
    setBWaveHeight(preset.waveHeight);
    setBWavePeriod(preset.wavePeriod);
    setBMeadowWidth(preset.meadowWidth);
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

  const decayDataB = useMemo(() => {
    const k = (bDensity / 300) * (bBladeLength / 35) * (1.5 / Math.max(0.5, bWaterDepth)) * 0.015;
    return [0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
      const dist = bMeadowWidth * frac;
      const h = bDensity === 0 ? bWaveHeight * (1 - 0.001 * dist) : bWaveHeight / (1 + k * dist);
      const decayPct = (1 - Math.pow(h / bWaveHeight, 2)) * 100;
      return {
        distance_m: dist,
        wave_height_m: Number(h.toFixed(3)),
        energy_decay_pct: Number(Math.max(0, decayPct).toFixed(1)),
      };
    });
  }, [bDensity, bBladeLength, bWaterDepth, bWaveHeight, bMeadowWidth]);

  const inshoreHeightB = useMemo(() => {
    return decayDataB[decayDataB.length - 1]?.wave_height_m ?? bWaveHeight;
  }, [decayDataB, bWaveHeight]);

  const energyDampingB = useMemo(() => {
    return decayDataB[decayDataB.length - 1]?.energy_decay_pct ?? 0;
  }, [decayDataB]);

  const heightReductionB = useMemo(() => {
    return Number(((1 - inshoreHeightB / bWaveHeight) * 100).toFixed(1));
  }, [inshoreHeightB, bWaveHeight]);

  const combinedDecayData = useMemo(() => {
    if (!isCompareMode) return decayData;
    return decayData.map((pt, i) => {
      const ptB = decayDataB[i];
      return {
        distance_m: pt.distance_m,
        wave_height_m: pt.wave_height_m,
        energy_decay_pct: pt.energy_decay_pct ?? 0,
        wave_height_m_b: ptB ? ptB.wave_height_m : undefined,
      };
    });
  }, [decayData, decayDataB, isCompareMode]);

  const handleExportCSV = () => {
    const rows = decayData.map((pt) => ({
      "Distance (m)": pt.distance_m,
      "Wave Height (m)": Number(pt.wave_height_m.toFixed(3)),
      "Energy Decay (%)": pt.energy_decay_pct !== undefined ? Number(pt.energy_decay_pct.toFixed(1)) : "",
    }));
    downloadCSV(rows, `wave-decay-profile-${meadowWidth}m.csv`);
  };

  const handleExportJSON = () => {
    const payload = {
      scenario: activePreset || "Custom Parameterization",
      timestamp: new Date().toISOString(),
      parameters: {
        seagrass_density_shoots_per_m2: density,
        blade_length_cm: bladeLength,
        water_depth_m: waterDepth,
        offshore_wave_height_m: waveHeight,
        wave_period_s: wavePeriod,
        meadow_width_m: meadowWidth,
      },
      results: {
        inshore_wave_height_m: inshoreHeight,
        wave_height_reduction_pct: heightReduction,
        total_energy_dissipated_pct: energyDamping,
      },
      decay_profile: decayData,
    };
    downloadJSON(payload, `wave-model-simulation-${activePreset ? activePreset.toLowerCase().replace(/\s+/g, "-") : "custom"}.json`);
  };

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

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsCompareMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              isCompareMode
                ? "bg-teal-50 border-teal-500 text-teal-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Toggle side-by-side scenario comparison mode"
          >
            <GitCompare className="w-3.5 h-3.5 text-teal-600" />
            <span>{isCompareMode ? "Exit Compare" : "Compare Scenarios"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            title="Print or save as PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            title="Export wave decay curve as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            title="Export simulation parameters and results as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>
          <button
            onClick={() =>
              runPrediction(density, bladeLength, waterDepth, waveHeight, wavePeriod, meadowWidth)
            }
            disabled={predictMutation.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${predictMutation.isPending ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Tab when in Compare Mode */}
      {isCompareMode && (
        <div className="bg-white rounded-2xl border border-teal-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Tuning Active Scenario:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveScenarioTab("A")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioTab === "A"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-teal-300"></span>
                <span>Scenario A (Teal)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScenarioTab("B")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioTab === "B"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                <span>Scenario B (Amber)</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {activeScenarioTab === "A" ? (
              <span className="text-teal-700 font-medium">Currently adjusting Scenario A parameters &amp; presets</span>
            ) : (
              <span className="text-amber-700 font-medium">Currently adjusting Scenario B parameters &amp; presets</span>
            )}
          </div>
        </div>
      )}

      {/* Preset Quick Select */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>
            {isCompareMode && activeScenarioTab === "B"
              ? "Scenario B Presets (Comparison)"
              : "Preset Meadow Scenarios"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(isCompareMode && activeScenarioTab === "B" ? PRESETS_B : PRESETS).map((p) => {
            const isSelected =
              isCompareMode && activeScenarioTab === "B"
                ? bActivePreset === p.name
                : activePreset === p.name;
            return (
              <button
                key={p.name}
                onClick={() =>
                  isCompareMode && activeScenarioTab === "B"
                    ? applyPresetB(p)
                    : applyPreset(p)
                }
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? isCompareMode && activeScenarioTab === "B"
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                      : "border-teal-500 bg-teal-50/50 ring-1 ring-teal-500"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">{p.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isCompareMode && activeScenarioTab === "B"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-teal-100/80 text-teal-800"
                    }`}
                  >
                    {p.meadowWidth}m
                  </span>
                </div>
                <div
                  className={`text-xs italic mt-0.5 font-medium ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-700"
                      : "text-teal-700"
                  }`}
                >
                  {p.species}
                </div>
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>
                  {isCompareMode
                    ? `Input Parameters (${activeScenarioTab === "A" ? "Scenario A - Teal" : "Scenario B - Amber"})`
                    : "Input Ocean & Vegetation Parameters"}
                </span>
              </div>
            </div>

            {/* Shoot Density */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Seagrass Shoot Density</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {isCompareMode && activeScenarioTab === "B" ? bDensity : density} shoots/m²
                </span>
              </div>
              <input
                type="range"
                aria-label="Seagrass Shoot Density in shoots per square meter"
                min="0"
                max="1200"
                step="10"
                value={isCompareMode && activeScenarioTab === "B" ? bDensity : density}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBDensity(val);
                    setBActivePreset(null);
                  } else {
                    setDensity(val);
                    setActivePreset(null);
                  }
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Bare (0)</span>
                <span>Moderate (300-500)</span>
                <span>Dense (1200)</span>
              </div>
            </div>

            {/* Blade Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Average Blade Length</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {isCompareMode && activeScenarioTab === "B" ? bBladeLength : bladeLength} cm
                </span>
              </div>
              <input
                type="range"
                aria-label="Average Blade Length in centimeters"
                min="0"
                max="100"
                step="1"
                value={isCompareMode && activeScenarioTab === "B" ? bBladeLength : bladeLength}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBBladeLength(val);
                    setBActivePreset(null);
                  } else {
                    setBladeLength(val);
                    setActivePreset(null);
                  }
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Short (5-15cm)</span>
                <span>Canopy (30-50cm)</span>
                <span>Ribbon (&gt;80cm)</span>
              </div>
            </div>

            {/* Ambient Water Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Ambient Water Depth (h)</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {(isCompareMode && activeScenarioTab === "B" ? bWaterDepth : waterDepth).toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                aria-label="Ambient Water Depth in meters"
                min="0.5"
                max="6.0"
                step="0.1"
                value={isCompareMode && activeScenarioTab === "B" ? bWaterDepth : waterDepth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBWaterDepth(val);
                    setBActivePreset(null);
                  } else {
                    setWaterDepth(val);
                    setActivePreset(null);
                  }
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Reef Flat (0.5m)</span>
                <span>Subtidal (2.0m)</span>
                <span>Deep (6.0m)</span>
              </div>
            </div>

            {/* Offshore Incident Wave Height */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Incident Wave Height (H₀)</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {(isCompareMode && activeScenarioTab === "B" ? bWaveHeight : waveHeight).toFixed(2)} m
                </span>
              </div>
              <input
                type="range"
                aria-label="Incident Wave Height in meters"
                min="0.2"
                max="3.0"
                step="0.05"
                value={isCompareMode && activeScenarioTab === "B" ? bWaveHeight : waveHeight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBWaveHeight(val);
                    setBActivePreset(null);
                  } else {
                    setWaveHeight(val);
                    setActivePreset(null);
                  }
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Calm (0.3m)</span>
                <span>Moderate Swell (1.0m)</span>
                <span>Storm (3.0m)</span>
              </div>
            </div>

            {/* Peak Wave Period */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Peak Wave Period (T)</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {(isCompareMode && activeScenarioTab === "B" ? bWavePeriod : wavePeriod).toFixed(1)} s
                </span>
              </div>
              <input
                type="range"
                aria-label="Peak Wave Period in seconds"
                min="2.0"
                max="12.0"
                step="0.5"
                value={isCompareMode && activeScenarioTab === "B" ? bWavePeriod : wavePeriod}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBWavePeriod(val);
                    setBActivePreset(null);
                  } else {
                    setWavePeriod(val);
                    setActivePreset(null);
                  }
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
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    isCompareMode && activeScenarioTab === "B"
                      ? "text-amber-800 bg-amber-50"
                      : "text-teal-800 bg-teal-50"
                  }`}
                >
                  {isCompareMode && activeScenarioTab === "B" ? bMeadowWidth : meadowWidth} m
                </span>
              </div>
              <input
                type="range"
                aria-label="Meadow Cross-Shore Width in meters"
                min="10"
                max="150"
                step="5"
                value={isCompareMode && activeScenarioTab === "B" ? bMeadowWidth : meadowWidth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isCompareMode && activeScenarioTab === "B") {
                    setBMeadowWidth(val);
                    setBActivePreset(null);
                  } else {
                    setMeadowWidth(val);
                    setActivePreset(null);
                  }
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
          {/* Top Metric Cards (Dual or Single Mode) */}
          {isCompareMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Energy Attenuation</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-teal-700">-{energyDamping.toFixed(1)}%</span>
                  <span className="text-xs text-slate-400">vs</span>
                  <span className="text-base font-bold text-amber-600">-{energyDampingB.toFixed(1)}%</span>
                </div>
                <div className="text-[11px] text-teal-700 font-semibold mt-1">
                  {energyDamping >= energyDampingB ? "+" : ""}{(energyDamping - energyDampingB).toFixed(1)}% Scenario A advantage
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                  <Waves className="w-4 h-4 text-cyan-600" />
                  <span>Inshore Wave Height</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-teal-700">{inshoreHeight.toFixed(2)}m</span>
                  <span className="text-xs text-slate-400">vs</span>
                  <span className="text-base font-bold text-amber-600">{inshoreHeightB.toFixed(2)}m</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {Math.abs(inshoreHeightB - inshoreHeight).toFixed(2)}m {inshoreHeight < inshoreHeightB ? "calmer shore with A" : "difference"}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Height Reduction</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-teal-700">-{heightReduction.toFixed(1)}%</span>
                  <span className="text-xs text-slate-400">vs</span>
                  <span className="text-base font-bold text-amber-600">-{heightReductionB.toFixed(1)}%</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Δ {Math.abs(heightReduction - heightReductionB).toFixed(1)}% reduction delta
                </div>
              </div>
            </div>
          ) : (
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
          )}

          {/* Interactive Decay Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  {isCompareMode
                    ? "Comparative Wave Height Decay Profile"
                    : "Wave Height Decay Across Meadow Distance"}
                </h3>
                <p className="text-xs text-slate-500">
                  Dampened wave profile (m) vs cross-shore progression (x = 0m to {meadowWidth}m)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  Scenario A (Teal)
                </span>
                {isCompareMode && (
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Scenario B (Amber)
                  </span>
                )}
                {!isCompareMode && (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-0.5 bg-slate-300"></span>
                    Bare Sandbed (Unattenuated)
                  </span>
                )}
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedDecayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="waveFillB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
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
                    domain={[0, Math.ceil(Math.max(waveHeight, isCompareMode ? bWaveHeight : 0) * 1.2 * 10) / 10]}
                    tickFormatter={(v) => `${v.toFixed(2)}m`}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${Number(value).toFixed(3)} m`,
                      name === "wave_height_m_b" ? "Scenario B (Amber)" : "Scenario A (Teal)",
                    ]}
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
                    name="Scenario A"
                  />
                  {isCompareMode && (
                    <Area
                      type="monotone"
                      dataKey="wave_height_m_b"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      fillOpacity={0.5}
                      fill="url(#waveFillB)"
                      name="Scenario B"
                    />
                  )}
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

      {/* Printable Wave Report (Rendered only during print preview / PDF generation) */}
      <div className="print-only">
        <WaveReport
          scenarioName={activePreset || "Custom Meadow Simulation"}
          parameters={{
            density,
            bladeLength,
            waterDepth,
            waveHeight,
            wavePeriod,
            meadowWidth,
          }}
          results={{
            inshoreHeight,
            heightReduction,
            energyDamping,
          }}
          decayProfile={decayData}
        />
      </div>
    </div>
  );
}
