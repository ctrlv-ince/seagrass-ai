import { useAdminAnalytics, useSystemInfo } from "../../api/admin";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Users,
  ClipboardList,
  Images,
  TreePine,
  Activity,
  HardDrive,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react";

export function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading, refetch } = useAdminAnalytics();
  const { data: systemInfo } = useSystemInfo();
  const { isConfigured, role, setDemoRole } = useAuth();

  const totalSurveys = analytics?.total_surveys ?? 0;
  const totalUsers = analytics?.total_users ?? 0;
  const totalImages = analytics?.total_images ?? 0;
  const totalSpecies = analytics?.total_species ?? 0;
  const storageMB = analytics ? (analytics.storage_used_bytes / 1_000_000).toFixed(1) : "0.0";

  const monthlyData = analytics?.surveys_monthly_trend ?? [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live Infrastructure
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Operations Center
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            System telemetry, global user authorization, taxa reference management, and survey lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isConfigured && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c1626] border border-slate-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Demo Clearance:</span>
              <select
                aria-label="Demo Role Clearance"
                value={role}
                onChange={(e) => setDemoRole(e.target.value as "admin" | "user")}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 rounded-lg px-2 py-1 text-xs font-mono font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          )}

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {analyticsLoading ? "..." : totalUsers}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              {analytics?.users_by_role?.admin ?? 0} Admins
            </span>
            <span>·</span>
            <span className="font-mono">
              {analytics?.users_by_role?.user ?? 0} Users
            </span>
          </div>
        </div>

        {/* Global Surveys */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-500/30 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Field Surveys
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-500/20 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {analyticsLoading ? "..." : totalSurveys}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-teal-600 dark:text-teal-400 font-semibold font-mono">
              {analytics?.surveys_by_status?.completed ?? 0} Completed
            </span>
            <span>·</span>
            <span className="font-mono">
              {analytics?.surveys_by_status?.in_progress ?? 0} Active
            </span>
          </div>
        </div>

        {/* Captured Images & Storage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Survey Imagery
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 group-hover:scale-105 transition-transform">
              <Images className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {analyticsLoading ? "..." : totalImages}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
              ~{storageMB} MB
            </span>
            <span>in S3 storage</span>
          </div>
        </div>

        {/* Species Catalog */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cataloged Taxa
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/20 group-hover:scale-105 transition-transform">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {analyticsLoading ? "..." : totalSpecies}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">
              {analytics?.total_quadrats ?? 0}
            </span>
            <span>quadrat points mapped</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Trends & System Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Survey Ingestion Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Field Survey Ingestion Velocity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Surveys collected across marine monitoring stations over time
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-semibold">
              12 Month Trajectory
            </span>
          </div>

          {monthlyData.length > 0 ? (
            <div className="space-y-4">
              <div className="h-44 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
                {monthlyData.map((item, idx) => {
                  const maxCount = Math.max(...monthlyData.map((d) => d.count), 1);
                  const heightPercent = Math.max((item.count / maxCount) * 100, 8);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/40 via-teal-500/70 to-emerald-500 group-hover:to-teal-400 transition-all shadow-xs"
                      />
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-full">
                        {item.month.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Total Period Ingested: {monthlyData.reduce((acc, d) => acc + d.count, 0)} surveys</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Status: Active Syncing</span>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Activity className="w-6 h-6 mb-2 text-slate-400 dark:text-slate-600" />
              <p className="text-xs">No historical survey trends recorded yet</p>
            </div>
          )}
        </div>

        {/* System Pulse Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                System Pulse
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  systemInfo?.status === "healthy"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                    : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                }`}
              >
                {systemInfo?.status === "healthy" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {systemInfo?.status ? systemInfo.status.toUpperCase() : "CHECKING"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  PostgreSQL + PostGIS
                </span>
                <span
                  className={`font-mono font-semibold ${
                    systemInfo?.database_connected ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                  }`}
                >
                  {systemInfo?.database_connected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Inference Model
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                  {systemInfo?.yolo_model_path || "YOLOv11"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Images className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Object Storage
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {systemInfo?.s3_bucket || "seagrass-images"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Cache Entries
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {systemInfo?.cache_entries ?? 0} hot keys
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/system"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            Detailed Diagnostics
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Administrative Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* User Management */}
          <Link
            to="/admin/users"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              User Directory
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure credentials, assign role privileges, and toggle account activation.
            </p>
          </Link>

          {/* Survey Control */}
          <Link
            to="/admin/surveys"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-500/40 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center justify-between">
              Survey Control
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Oversee all field surveys globally, perform bulk state transitions, or prune sessions.
            </p>
          </Link>

          {/* Species Catalog */}
          <Link
            to="/admin/species"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
              Species Catalog
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Maintain scientific taxonomy, vernacular names, and ecological descriptions.
            </p>
          </Link>

          {/* Reports & Analytics (NEW) */}
          <Link
            to="/admin/reports"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
              Reports & Graphs
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive telemetry analytics, species composition, wave damping, and CSV &amp; PDF exports.
            </p>
          </Link>

          {/* System Settings */}
          <Link
            to="/admin/system"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
              System Settings
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Engine weights, environment topology, latency checks, and runtime operational parameters.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
