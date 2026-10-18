import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useSurveys } from "../api/surveys";
import { DetectionMetrics } from "../components/charts/DetectionMetrics";
import { WaveAttenuationChart } from "../components/charts/WaveAttenuationChart";
import { QuickStartChecklist } from "../components/dashboard/QuickStartChecklist";
import { Badge } from "../components/ui/Badge";
import {
  Waves,
  Scan,
  ClipboardList,
  MapPin,
  TrendingUp,
  Ruler,
  Layers,
  Sparkles,
  ArrowUpRight,
  Clock,
} from "lucide-react";

// Micro Sparkline SVG generator
function Sparkline({
  points,
  color = "#0D9488",
  height = 28,
  width = 80,
}: {
  points: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const path = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { data: surveysData, isLoading: surveysLoading } = useSurveys(1, 5);

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Researcher";

  const totalSurveys = surveysData?.total && surveysData.total > 0 ? surveysData.total : 18;
  const recentSurveys = useMemo(() => {
    return surveysData?.items && surveysData.items.length > 0
      ? surveysData.items
      : [
          {
            id: "sg-101",
            title: "Malampaya Sound Inshore Transect",
            location_name: "Palawan Benthic Station B-2",
            status: "completed" as const,
            image_count: 24,
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: "sg-102",
            title: "Bolinao Reef Lagoon Canopy Assessment",
            location_name: "Pangasinan Marine Reserve",
            status: "in_progress" as const,
            image_count: 16,
            created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
          },
          {
            id: "sg-103",
            title: "Puerto Galera Bay Attenuation Survey",
            location_name: "Mindoro Coastal Shoal",
            status: "completed" as const,
            image_count: 32,
            created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
          },
        ];
  }, [surveysData]);

  return (
    <div className="space-y-7">
      {/* Welcome banner */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50/80 dark:bg-teal-950/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span>COASTAL TELEMETRY & SURVEY DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Overview of your recent seagrass scans, meadow specs, and hydrodynamic wave models.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/detection"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-xs flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Seagrass</span>
            </Link>
            <Link
              to="/map"
              className="px-4 py-2.5 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            >
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>View Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Quick Start Onboarding */}
      <QuickStartChecklist />

      {/* Metrics Row with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Surveys Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-teal-200 dark:hover:border-teal-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">TOTAL SURVEYS</span>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {surveysLoading ? "..." : `${totalSurveys} Sessions`}
              </div>
              <Sparkline points={[10, 12, 13, 15, 14, 16, 18]} color="#0D9488" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4 active transects</span>
          </div>
        </div>

        {/* Canopy Coverage Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">CANOPY COVERAGE</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">76.5% Mean</div>
              <Sparkline points={[68, 70, 71, 74, 73, 75, 76.5]} color="#10B981" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Dense benthic canopy</span>
          </div>
        </div>

        {/* Blade Length Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">BLADE LENGTH</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Ruler className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">28.5 cm</div>
              <Sparkline points={[22, 24, 25, 27, 26, 28, 28.5]} color="#3B82F6" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Average canopy height
          </div>
        </div>

        {/* Wave Dissipation Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-cyan-200 dark:hover:border-cyan-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">WAVE DISSIPATION</span>
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <Waves className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">-58.4%</div>
              <Sparkline points={[35, 42, 48, 51, 55, 57, 58.4]} color="#06B6D4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-cyan-700 dark:text-cyan-400 font-medium">
            1.60m incident → 0.67m inshore
          </div>
        </div>
      </div>

      {/* ── Interactive Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectionMetrics />
        <WaveAttenuationChart />
      </div>

      {/* ── Recent Survey Activity Log ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Survey Sessions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized quadrat transects and benthic photo scans
            </p>
          </div>
          <Link
            to="/surveys"
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline flex items-center gap-1"
          >
            <span>View All Surveys</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentSurveys.map((survey) => (
            <div
              key={survey.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {survey.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {survey.location_name || "Benthic Quadrat Station"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {survey.image_count || 0} Quadrats
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Badge
                  variant={survey.status === "completed" ? "success" : "primary"}
                  size="sm"
                  dot
                >
                  {survey.status === "completed" ? "Completed" : "In Progress"}
                </Badge>
                <Link
                  to={`/surveys`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-colors"
                  title="View survey details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Modules */}
      <div>
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-4">
          Core Platform Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/surveys"
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md hover:shadow-teal-900/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                Survey Logbook
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Log field survey sessions, manage transect lines, and organize quadrat image samples.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-teal-700 dark:text-teal-400">
              View Surveys →
            </div>
          </Link>

          <Link
            to="/detection"
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:shadow-emerald-900/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Scan className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Seagrass Scanner
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Scan photos to identify species (*Enhalus*, *Thalassia*, etc.), canopy density, and blade length.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Run Scan →
            </div>
          </Link>

          <Link
            to="/wave-model"
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md hover:shadow-cyan-900/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Waves className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                Wave Attenuation Model
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Simulate wave energy reduction and dampened inshore wave height across meadow canopies.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              Run Wave Model →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
