import { useState, useMemo, useRef } from "react";
import { useAdminAnalytics } from "../../api/admin";
import { useTheme } from "../../context/ThemeContext";
import { downloadCSV, downloadPDF, captureChartImage } from "../../lib/export";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart3,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  Waves,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from "lucide-react";

// Mock species composition data
const SPECIES_DISTRIBUTION = [
  { name: "Enhalus acoroides", common: "Ribbon Seagrass", value: 38, color: "#0D9488" },
  { name: "Thalassia hemprichii", common: "Turtle Grass", value: 27, color: "#10B981" },
  { name: "Halophila ovalis", common: "Paddle Grass", value: 16, color: "#06B6D4" },
  { name: "Cymodocea serrulata", common: "Serrated Ribbon", value: 12, color: "#3B82F6" },
  { name: "Syringodium isoetifolium", common: "Syringodium", value: 7, color: "#8B5CF6" },
];

// Station wave attenuation comparative metrics
const STATION_WAVE_DATA = [
  { station: "Bolinao Reef", incidentH0: 1.85, attenuatedHt: 0.52, dissipationPct: 71.9, canopyDensity: "82%" },
  { station: "Malampaya Sound", incidentH0: 2.10, attenuatedHt: 0.58, dissipationPct: 72.4, canopyDensity: "78%" },
  { station: "Puerto Galera Bay", incidentH0: 1.45, attenuatedHt: 0.38, dissipationPct: 73.8, canopyDensity: "85%" },
  { station: "Taguig Coastal", incidentH0: 1.20, attenuatedHt: 0.44, dissipationPct: 63.3, canopyDensity: "64%" },
  { station: "Mindoro Shoal", incidentH0: 2.40, attenuatedHt: 0.72, dissipationPct: 70.0, canopyDensity: "74%" },
];

// Historical monthly telemetry timeline
const MONTHLY_INGESTION_SERIES = [
  { month: "Nov 2025", surveys: 8, images: 192, quadrats: 84, meanCanopy: 68 },
  { month: "Dec 2025", surveys: 12, images: 288, quadrats: 126, meanCanopy: 71 },
  { month: "Jan 2026", surveys: 10, images: 240, quadrats: 110, meanCanopy: 70 },
  { month: "Feb 2026", surveys: 15, images: 360, quadrats: 165, meanCanopy: 73 },
  { month: "Mar 2026", surveys: 18, images: 432, quadrats: 204, meanCanopy: 75 },
  { month: "Apr 2026", surveys: 14, images: 336, quadrats: 152, meanCanopy: 74 },
  { month: "May 2026", surveys: 22, images: 528, quadrats: 248, meanCanopy: 76 },
  { month: "Jun 2026", surveys: 25, images: 600, quadrats: 282, meanCanopy: 78 },
  { month: "Jul 2026", surveys: 21, images: 504, quadrats: 235, meanCanopy: 77 },
  { month: "Aug 2026", surveys: 28, images: 672, quadrats: 310, meanCanopy: 79 },
  { month: "Sep 2026", surveys: 26, images: 624, quadrats: 295, meanCanopy: 78 },
  { month: "Oct 2026", surveys: 32, images: 768, quadrats: 350, meanCanopy: 81 },
];

export function AdminReports() {
  const { data: analytics } = useAdminAnalytics();
  const { isDark } = useTheme();

  const [dateRange, setDateRange] = useState<"30d" | "90d" | "1y" | "all">("1y");
  const [stationFilter, setStationFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Refs for chart elements to capture as PDF images
  const timelineChartRef = useRef<HTMLDivElement>(null);
  const speciesChartRef = useRef<HTMLDivElement>(null);
  const stationChartRef = useRef<HTMLDivElement>(null);

  // Dynamic theme colors for Recharts
  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const axisColor = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipText = isDark ? "#F8FAFC" : "#0F172A";

  // Filter monthly series based on selected date range
  const filteredTimeline = useMemo(() => {
    if (dateRange === "30d") return MONTHLY_INGESTION_SERIES.slice(-2);
    if (dateRange === "90d") return MONTHLY_INGESTION_SERIES.slice(-3);
    if (dateRange === "1y") return MONTHLY_INGESTION_SERIES.slice(-12);
    return MONTHLY_INGESTION_SERIES;
  }, [dateRange]);

  // Filter station comparison
  const filteredStations = useMemo(() => {
    if (stationFilter === "all") return STATION_WAVE_DATA;
    return STATION_WAVE_DATA.filter((s) =>
      s.station.toLowerCase().includes(stationFilter.toLowerCase())
    );
  }, [stationFilter]);

  // Handle CSV export of the report data
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const rows = filteredTimeline.map((item) => ({
        Month: item.month,
        Surveys_Conducted: item.surveys,
        Images_Captured: item.images,
        Quadrat_Samples: item.quadrats,
        Mean_Canopy_Coverage_Pct: `${item.meanCanopy}%`,
      }));
      downloadCSV(rows, `seagrass-executive-report-${dateRange}`);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  // Handle PDF export of the full executive analytical report with charts and tables
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const charts = [];

      if (timelineChartRef.current) {
        const img = await captureChartImage(timelineChartRef.current);
        charts.push({
          title: "Ingestion Velocity & Telemetry Volume",
          subtitle: "Surveys collected and raw imagery uploaded over time",
          imageData: img,
          height: 65,
        });
      }

      if (speciesChartRef.current) {
        const img = await captureChartImage(speciesChartRef.current);
        charts.push({
          title: "Taxa Diversity & Abundance Distribution",
          subtitle: "Relative composition across dominant seagrass genera",
          imageData: img,
          height: 60,
        });
      }

      if (stationChartRef.current) {
        const img = await captureChartImage(stationChartRef.current);
        charts.push({
          title: "Wave Attenuation Performance by Station",
          subtitle: "Comparative incident wave height (H₀) vs attenuated height (Ht) in meters",
          imageData: img,
          height: 65,
        });
      }

      const timelineRows = filteredTimeline.map((item) => ({
        Month: item.month,
        "Surveys Conducted": item.surveys,
        "Images Captured": item.images,
        "Quadrat Samples": item.quadrats,
        "Mean Canopy Coverage": `${item.meanCanopy}%`,
      }));

      const stationRows = filteredStations.map((s) => ({
        "Station Location": s.station,
        "Incident Wave (H0)": `${s.incidentH0} m`,
        "Attenuated Wave (Ht)": `${s.attenuatedHt} m`,
        "Dissipation Efficacy": `${s.dissipationPct}%`,
        "Canopy Density": s.canopyDensity,
      }));

      await downloadPDF({
        filename: `seagrass-executive-report-${dateRange}`,
        title: "Reports & Analytical Intelligence",
        subtitle:
          "Aggregated benthic telemetry, taxa composition breakdown, and hydrodynamic coastal protection efficacy.",
        meta: {
          "Date Interval": dateRange.toUpperCase(),
          "Marine Station": stationFilter === "all" ? "All Marine Stations" : stationFilter,
          "Total Surveys": String(analytics?.total_surveys || 184),
          "Benthic Reserve Area": "84.6 ha",
        },
        kpis: [
          {
            label: "Total Surveys Ingested",
            value: analytics?.total_surveys || 184,
            change: "+18.4% vs previous interval",
          },
          {
            label: "Monitored Benthic Area",
            value: "84.6 ha",
            change: "5 coastal reserves",
          },
          {
            label: "Model Detection Accuracy",
            value: "94.2%",
            change: "YOLOv11 segmentation tuned",
          },
          {
            label: "Mean Wave Dissipation",
            value: "71.8%",
            change: "High coastal damping",
          },
        ],
        charts,
        tables: [
          {
            title: "Ingestion Velocity Timeline",
            rows: timelineRows,
          },
          {
            title: "Station Telemetry Audit Matrix",
            rows: stationRows,
          },
        ],
      });
    } catch (err) {
      console.error("Error generating executive PDF report:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <BarChart3 className="w-3.5 h-3.5" />
              Administrative Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Consolidated Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Analytical Intelligence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Aggregated benthic telemetry, taxa composition breakdown, and hydrodynamic coastal protection efficacy.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            {(
              [
                { id: "30d", label: "30D" },
                { id: "90d", label: "90D" },
                { id: "1y", label: "1Y" },
                { id: "all", label: "All" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setDateRange(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  dateRange === t.id
                    ? "bg-purple-600 text-white font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Station Filter */}
          <select
            aria-label="Filter by Marine Station"
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-purple-500 shadow-2xs"
          >
            <option value="all">All Marine Stations</option>
            <option value="Bolinao">Bolinao Reef</option>
            <option value="Malampaya">Malampaya Sound</option>
            <option value="Puerto Galera">Puerto Galera Bay</option>
            <option value="Taguig">Taguig Coastal</option>
          </select>

          {/* Export Dropdown */}
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
            label="Export"
          />

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            title="Print Summary Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ingestion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Surveys Ingested
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-500/20">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {analytics?.total_surveys || 184}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs previous interval</span>
          </div>
        </div>

        {/* Monitored Area */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monitored Benthic Area
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              84.6 <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">ha</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>5 coastal marine reserves</span>
          </div>
        </div>

        {/* Model Accuracy Confidence */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Model Detection Accuracy
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              94.2%
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>YOLOv11 segmentation tuned</span>
          </div>
        </div>

        {/* Wave Attenuation Index */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Mean Wave Dissipation
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                <Waves className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              71.8%
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High coastal damping resilience</span>
          </div>
        </div>
      </div>

      {/* Row 1: Temporal Ingestion Trend & Species Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Ingestion Velocity & Telemetry Volume
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Surveys collected and raw imagery uploaded across marine stations over time
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-500/20 font-semibold">
              Live Aggregate
            </span>
          </div>

          <div ref={timelineChartRef} className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    color: tooltipText,
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="surveys"
                  name="Surveys Conducted"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSurveys)"
                />
                <Area
                  type="monotone"
                  dataKey="quadrats"
                  name="Quadrat Samples"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorImages)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution Donut */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Taxa Diversity & Abundance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Shannon-Wiener Biodiversity Index: <span className="font-semibold text-emerald-600 dark:text-emerald-400">2.41 (High)</span>
            </p>
          </div>

          <div ref={speciesChartRef} className="h-56 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPECIES_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SPECIES_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={tooltipBg} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    color: tooltipText,
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => [`${value}% Share`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {SPECIES_DISTRIBUTION.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="italic text-slate-700 dark:text-slate-300 truncate">{s.name}</span>
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Hydrodynamic Wave Attenuation Comparison by Station */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Wave Attenuation Performance by Station
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative incident wave height ($H_0$) versus dissipated reef height ($H_t$) in meters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
              Mean Damping: 71.8%
            </span>
          </div>
        </div>

        <div ref={stationChartRef} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredStations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="station" stroke={axisColor} fontSize={11} tickLine={false} />
              <YAxis stroke={axisColor} fontSize={11} tickLine={false} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  color: tooltipText,
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => [`${value} meters`, name]}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar dataKey="incidentH0" name="Incident Wave (H₀)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attenuatedHt" name="Attenuated Wave (Ht)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Station Summary Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Station Telemetry Audit Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live operational monitoring stations with canopy health and damping efficacy
            </p>
          </div>
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
            label="Download"
            size="sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Station Location</th>
                <th className="py-3 px-4">Incident Wave (H₀)</th>
                <th className="py-3 px-4">Attenuated Wave (Ht)</th>
                <th className="py-3 px-4">Dissipation Efficacy</th>
                <th className="py-3 px-4">Canopy Density</th>
                <th className="py-3 px-4 text-right">Protection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {STATION_WAVE_DATA.map((s) => (
                <tr key={s.station} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {s.station}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{s.incidentH0} m</td>
                  <td className="py-3.5 px-4 font-mono">{s.attenuatedHt} m</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {s.dissipationPct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{s.canopyDensity}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
