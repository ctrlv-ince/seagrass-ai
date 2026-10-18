import { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Waves, Activity, Download } from "lucide-react";
import { downloadCSV } from "../../lib/export";

interface CurvePoint {
  distance_m: number;
  wave_height_m: number;
  unvegetated_height_m: number;
  attenuation_pct: number;
}

const DEFAULT_DECAY_CURVE: CurvePoint[] = [
  { distance_m: 0, wave_height_m: 1.60, unvegetated_height_m: 1.60, attenuation_pct: 0 },
  { distance_m: 10, wave_height_m: 1.41, unvegetated_height_m: 1.58, attenuation_pct: 12 },
  { distance_m: 20, wave_height_m: 1.23, unvegetated_height_m: 1.56, attenuation_pct: 23 },
  { distance_m: 30, wave_height_m: 1.07, unvegetated_height_m: 1.54, attenuation_pct: 33 },
  { distance_m: 40, wave_height_m: 0.94, unvegetated_height_m: 1.52, attenuation_pct: 41 },
  { distance_m: 50, wave_height_m: 0.83, unvegetated_height_m: 1.50, attenuation_pct: 48 },
  { distance_m: 65, wave_height_m: 0.74, unvegetated_height_m: 1.48, attenuation_pct: 54 },
  { distance_m: 80, wave_height_m: 0.69, unvegetated_height_m: 1.46, attenuation_pct: 57 },
  { distance_m: 100, wave_height_m: 0.67, unvegetated_height_m: 1.44, attenuation_pct: 58.4 },
];

interface WaveAttenuationChartProps {
  data?: CurvePoint[];
  title?: string;
  incidentHeight?: number;
  transmittedHeight?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  showUnvegetated?: boolean;
}

function WaveCustomTooltip({ active, payload, showUnvegetated = true }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload as CurvePoint;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-cyan-300 font-mono">
          Transect Distance: {item.distance_m} m
        </p>
        <div className="pt-1.5 border-t border-slate-800 space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-teal-300">With Seagrass:</span>
            <span className="font-mono font-bold text-white">
              {item.wave_height_m.toFixed(2)} m
            </span>
          </div>
          {showUnvegetated && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Bare Substrate:</span>
              <span className="font-mono text-slate-300">
                {item.unvegetated_height_m.toFixed(2)} m
              </span>
            </div>
          )}
          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
            <span className="text-slate-300">Energy Attenuation:</span>
            <span className="font-mono font-bold text-emerald-400">
              -{item.attenuation_pct}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function WaveAttenuationChart({
  data = DEFAULT_DECAY_CURVE,
  title = "Hydrodynamic Wave Attenuation Decay Curve",
  incidentHeight = 1.60,
  transmittedHeight = 0.67,
}: WaveAttenuationChartProps) {
  const [showUnvegetated, setShowUnvegetated] = useState(true);

  const handleExport = () => {
    const rows = data.map((d) => ({
      "Distance (m)": d.distance_m,
      "Wave Height with Seagrass (m)": d.wave_height_m,
      "Bare Substrate Wave Height (m)": d.unvegetated_height_m,
      "Wave Energy Attenuation (%)": d.attenuation_pct,
    }));
    downloadCSV(rows, "wave-attenuation-decay-curve.csv");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-semibold">
              MENDEZ & LOSADA (2004)
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-200/60 dark:border-cyan-800 font-medium">
              <Waves className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Physics Engine
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {title}
          </h3>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Export decay curve data to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* Comparison toggle */}
          <button
            onClick={() => setShowUnvegetated((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showUnvegetated
                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{showUnvegetated ? "Hide Bare Seabed" : "Compare Bare Seabed"}</span>
          </button>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
          >
            <defs>
              <linearGradient id="waveHeightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <XAxis
              dataKey="distance_m"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => `${val}m`}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              domain={[0, 2.0]}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => `${val.toFixed(1)}m`}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <Tooltip content={<WaveCustomTooltip showUnvegetated={showUnvegetated} />} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
            <Area
              type="monotone"
              dataKey="wave_height_m"
              name="Wave Height over Meadow (m)"
              stroke="#0D9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#waveHeightGrad)"
            />
            {showUnvegetated && (
              <Line
                type="monotone"
                dataKey="unvegetated_height_m"
                name="Bare Seabed Baseline (m)"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Highlights */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">
            Incident: <strong className="text-slate-800 dark:text-slate-100 font-mono">{incidentHeight.toFixed(2)}m</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Transmitted: <strong className="text-teal-700 dark:text-teal-300 font-mono">{transmittedHeight.toFixed(2)}m</strong>
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-mono font-bold text-xs">
          -58.4% Total Wave Damping
        </div>
      </div>
    </div>
  );
}
