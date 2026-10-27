import { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon, ShieldCheck } from "lucide-react";
import { downloadCSV, downloadPDF, captureChartImage } from "../../lib/export";
import { ExportDropdown } from "../common/ExportDropdown";

interface SpeciesData {
  species: string;
  commonName: string;
  confidence: number;
  coverage: number;
  color: string;
}

const DEFAULT_METRICS: SpeciesData[] = [
  {
    species: "Enhalus acoroides",
    commonName: "Ribbon Seagrass",
    confidence: 96.8,
    coverage: 42,
    color: "#0D9488", // primary teal
  },
  {
    species: "Thalassia hemprichii",
    commonName: "Turtle Grass",
    confidence: 92.4,
    coverage: 28,
    color: "#06B6D4", // cyan
  },
  {
    species: "Halophila ovalis",
    commonName: "Paddle Grass",
    confidence: 88.5,
    coverage: 15,
    color: "#10B981", // emerald
  },
  {
    species: "Cymodocea serrulata",
    commonName: "Serrated Ribbon",
    confidence: 85.1,
    coverage: 10,
    color: "#3B82F6", // blue
  },
  {
    species: "Syringodium isoetifolium",
    commonName: "Syringodium",
    confidence: 79.8,
    coverage: 5,
    color: "#8B5CF6", // purple
  },
];

interface DetectionMetricsProps {
  data?: SpeciesData[];
  title?: string;
}

interface MetricsCustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function MetricsCustomTooltip({ active, payload }: MetricsCustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload as SpeciesData;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-teal-300 italic">{item.species}</p>
        <p className="text-slate-400">{item.commonName}</p>
        <div className="pt-1.5 border-t border-slate-800 flex justify-between gap-4">
          <span className="text-slate-300">Confidence:</span>
          <span className="font-mono font-bold text-emerald-400">
            {item.confidence}%
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-300">Canopy Coverage:</span>
          <span className="font-mono font-bold text-cyan-400">
            {item.coverage}%
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function DetectionMetrics({
  data = DEFAULT_METRICS,
  title = "AI Model Detection & Species Breakdown",
}: DetectionMetricsProps) {
  const [viewMode, setViewMode] = useState<"confidence" | "coverage">("confidence");
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const rows = data.map((d) => ({
        "Species": d.species,
        "Common Name": d.commonName,
        "Confidence (%)": d.confidence,
        "Coverage (%)": d.coverage,
      }));
      downloadCSV(rows, "detection-metrics.csv");
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const charts = [];
      if (chartRef.current) {
        const img = await captureChartImage(chartRef.current);
        charts.push({
          title: viewMode === "confidence"
            ? "YOLOv11 Model Inference Confidence by Species"
            : "Canopy Coverage Percentage Breakdown",
          subtitle: `Active visualization mode: ${viewMode.toUpperCase()}`,
          imageData: img,
          height: 65,
        });
      }

      const rows = data.map((d) => ({
        "Species": d.species,
        "Common Name": d.commonName,
        "Confidence (%)": `${d.confidence}%`,
        "Canopy Coverage (%)": `${d.coverage}%`,
      }));

      const avgConfidence = (data.reduce((acc, cur) => acc + cur.confidence, 0) / (data.length || 1)).toFixed(1);
      const totalCoverage = data.reduce((acc, cur) => acc + cur.coverage, 0);

      await downloadPDF({
        filename: "detection-metrics",
        title: title || "AI Model Detection & Species Breakdown",
        subtitle: "YOLOv11 segmentation accuracy and taxa canopy composition metrics.",
        meta: {
          "Model Architecture": "YOLOv11 Segmentation",
          "Taxa Genera": `${data.length} Identified`,
          "Mean Confidence": `${avgConfidence}%`,
          "Total Canopy Coverage": `${totalCoverage}%`,
        },
        kpis: [
          { label: "Mean Confidence", value: `${avgConfidence}%`, change: "Inference benchmark" },
          { label: "Canopy Coverage", value: `${totalCoverage}%`, change: "Estimated meadow area" },
          { label: "Classified Genera", value: data.length, change: "Active taxonomic classes" },
        ],
        charts,
        tables: [
          {
            title: "Taxa Detection & Canopy Metrics Table",
            rows,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to generate detection metrics PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold">
              YOLOv11 BENCHMARKS
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800 font-medium">
              <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Model Ready
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {title}
          </h3>
        </div>

        {/* View mode toggle button & export */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
            label="Export"
            size="sm"
          />

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => setViewMode("confidence")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "confidence"
                  ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Confidence</span>
            </button>
            <button
              onClick={() => setViewMode("coverage")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "coverage"
                  ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Coverage %</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Render Area */}
      <div ref={chartRef} className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "confidence" ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
                className="stroke-slate-100 dark:stroke-slate-800"
              />
              <XAxis
                dataKey="species"
                tick={{ fontSize: 11, fill: "#64748B" }}
                tickFormatter={(val: string) => val.split(" ")[0]}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 11, fill: "#64748B" }}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<MetricsCustomTooltip />} />
              <Bar
                dataKey="confidence"
                radius={[6, 6, 0, 0]}
                fill="#0D9488"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="coverage"
                nameKey="commonName"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<MetricsCustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Average Confidence: <strong className="text-slate-800 dark:text-slate-200 font-mono">88.5%</strong></span>
        <span>5 Classified Genera</span>
      </div>
    </div>
  );
}
