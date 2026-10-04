import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
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
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="space-y-7">
      {/* Welcome banner */}
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50/80 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>OVERVIEW DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Overview of your recent seagrass scans, meadow specs, and hydrodynamic wave models.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/detection"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Seagrass</span>
            </Link>
            <Link
              to="/map"
              className="px-4 py-2.5 rounded-xl font-medium text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>View Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-500">TOTAL SURVEYS</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900">18 Sessions</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4 added this week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-500">CANOPY COVERAGE</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900">76.5% Mean</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Healthy dense meadow
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-500">BLADE LENGTH</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Ruler className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900">28.5 cm</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Average canopy height
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-500">WAVE DISSIPATION</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900">-58.4% Energy</div>
          <div className="mt-1 text-xs text-cyan-700 font-medium">
            1.60m wave → 0.67m
          </div>
        </div>
      </div>

      {/* Quick Launch Modules */}
      <div>
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase mb-4">
          Core Platform Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/surveys"
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Survey Logbook
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Log field survey sessions, manage transect lines, and organize quadrat image samples.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-teal-700">
              View Surveys →
            </div>
          </Link>

          <Link
            to="/detection"
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                  <Scan className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Seagrass Scanner
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Scan photos to identify species (*Enhalus*, *Thalassia*, etc.), canopy density, and blade length.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
              Run Scan →
            </div>
          </Link>

          <Link
            to="/wave-model"
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-cyan-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 group-hover:bg-cyan-100 transition-colors">
                  <Waves className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Wave Attenuation Model
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Simulate wave energy reduction and dampened inshore wave height across meadow canopies.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-cyan-700">
              Run Wave Model →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
