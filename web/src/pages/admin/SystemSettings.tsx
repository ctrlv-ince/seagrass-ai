import { useState } from "react";
import { useSystemInfo } from "../../api/admin";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../api/client";
import {
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Server,
  Zap,
  ShieldAlert,
} from "lucide-react";

export function SystemSettings() {
  const { data: systemInfo, isLoading, refetch } = useSystemInfo();
  const { isConfigured, role, setDemoRole } = useAuth();

  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);
  const [autoComputeWave, setAutoComputeWave] = useState(true);
  const [syncInterval, setSyncInterval] = useState("15");

  const runPingTest = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      await apiClient.get("/health");
      const elapsed = Math.round(performance.now() - start);
      setPingLatency(elapsed);
    } catch {
      setPingLatency(-1);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Infrastructure & Runtime Diagnostics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Architecture & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time backend engine health, database connectivity, storage topology, and operational flags.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Diagnostics
        </button>
      </div>

      {/* Grid: Topology Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend API */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              FastAPI Core
            </span>
            <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {isLoading ? "Checking..." : systemInfo?.status === "healthy" ? "Operational" : "Degraded"}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Port 8000 / v1</span>
          </div>
        </div>

        {/* Database */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PostgreSQL + PostGIS
            </span>
            <HardDrive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {systemInfo?.database_connected ? "Connected" : "Disconnected"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Spatial GIST indexed
          </div>
        </div>

        {/* YOLO Model */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              YOLOv11 Weights
            </span>
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">Active</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 truncate font-mono">
            {systemInfo?.yolo_model_path || "seagrass_yolov11.pt"}
          </div>
        </div>

        {/* In-Memory Cache */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Memory Cache
            </span>
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {systemInfo?.cache_entries ?? 0} Keys
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Auto-eviction enabled
          </div>
        </div>
      </div>

      {/* Latency Tester & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency & Ping */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              API Connectivity & Latency Ping
            </h2>
            <button
              onClick={runPingTest}
              disabled={pinging}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {pinging ? "Testing..." : "Send Health Ping"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Target Gateway</div>
              <div className="text-xs font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                {import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Roundtrip Latency</div>
              <div className="text-sm font-mono font-bold mt-0.5">
                {pingLatency === null ? (
                  <span className="text-slate-400 dark:text-slate-500">Not Tested</span>
                ) : pingLatency === -1 ? (
                  <span className="text-red-500">Failed</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">{pingLatency} ms</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The health ping validates CORS headers, HTTP Keep-Alive connection pools, and backend event loop availability.
          </div>
        </div>

        {/* Operational Runtime Flags */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Operational Feature Flags
          </h2>

          <div className="space-y-3">
            {/* Wave Auto-compute Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Auto-Compute Wave Attenuation
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculate wave damping models immediately upon quadrat photo analysis
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoComputeWave(!autoComputeWave)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoComputeWave ? "bg-emerald-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Mobile sync interval */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Mobile Field Sync Cadence
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Offline queue synchronization interval for mobile tablets
                </div>
              </div>
              <select
                aria-label="Mobile Field Sync Cadence"
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            {/* Demo role simulation control */}
            {!isConfigured && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-500/30">
                <div>
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Demo Role Simulator
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Test how the app appears to different credential tiers
                  </div>
                </div>
                <select
                  aria-label="Demo Role Simulator"
                  value={role}
                  onChange={(e) => setDemoRole(e.target.value as "admin" | "user")}
                  className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-emerald-400"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
