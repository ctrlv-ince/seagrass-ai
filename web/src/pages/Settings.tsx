import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Database,
  Sliders,
  CheckCircle2,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/client";

export function Settings() {
  const { user, signOut } = useAuth();
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [defaultDepth, setDefaultDepth] = useState("1.5");
  const [defaultWaveHeight, setDefaultWaveHeight] = useState("0.8");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const checkApiHealth = async () => {
    setApiStatus("checking");
    try {
      const res = await apiClient.get("/health", { baseURL: "http://localhost:8000" });
      if (res.status === 200) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch {
      setApiStatus("offline");
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Platform &amp; Account Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          User Settings &amp; Infrastructure
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account profile, telemetry connection, and simulation defaults.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">User Account</h2>
              <span className="text-xs text-slate-500">Authenticated via Supabase</span>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              Email Address
            </span>
            <span className="text-slate-800 font-medium text-sm mt-0.5 block truncate">
              {user?.email || "user@seagrass.ai"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              User ID
            </span>
            <span className="text-slate-600 font-mono text-[11px] mt-0.5 block truncate">
              {user?.id || "local-user-session"}
            </span>
          </div>
        </div>
      </div>

      {/* Infrastructure Connection Status */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Infrastructure Connectivity</span>
          </div>

          <button
            onClick={checkApiHealth}
            className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${apiStatus === "checking" ? "animate-spin" : ""}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">PostgreSQL / PostGIS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="font-bold text-slate-900">Live (Port 6543)</div>
            <div className="text-[10px] text-slate-400">AWS ap-southeast-2</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Storage Bucket</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="font-bold text-slate-900">seagrass-images</div>
            <div className="text-[10px] text-slate-400">Public CDN Enabled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">FastAPI Engine</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-emerald-500"
                    : apiStatus === "checking"
                    ? "bg-amber-400"
                    : "bg-rose-500"
                }`}
              ></span>
            </div>
            <div className="font-bold text-slate-900">
              {apiStatus === "online" ? "Online (v0.1.0)" : apiStatus === "checking" ? "Testing..." : "Offline"}
            </div>
            <div className="text-[10px] text-slate-400">http://localhost:8000</div>
          </div>
        </div>
      </div>

      {/* Field Simulation Defaults Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>Default Simulation Parameters</span>
        </div>

        <form onSubmit={handleSaveDefaults} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default Water Depth (m)
              </label>
              <input
                type="number"
                step="0.1"
                value={defaultDepth}
                onChange={(e) => setDefaultDepth(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard baseline depth for quick scans (default: 1.5m)
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default Incident Wave Height (m)
              </label>
              <input
                type="number"
                step="0.05"
                value={defaultWaveHeight}
                onChange={(e) => setDefaultWaveHeight(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Offshore swell baseline (default: 0.80m)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Defaults saved for this session!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Save Defaults
            </button>
          </div>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-sm text-slate-800 block">Session Control</span>
          <span className="text-xs text-slate-500">Sign out of this user session on this device.</span>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
