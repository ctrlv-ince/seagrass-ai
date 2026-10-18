import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Database,
  Sliders,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import apiClient from "../api/client";

export function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
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
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-sm mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Platform &amp; Account Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          User Settings &amp; Infrastructure
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account profile, telemetry connection, and simulation defaults.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">User Account</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Authenticated via Supabase</span>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
            Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-slate-400 dark:text-slate-500 font-semibold block uppercase text-[10px]">
              Email Address
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium text-sm mt-0.5 block truncate">
              {user?.email || "user@seagrass.ai"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-slate-400 dark:text-slate-500 font-semibold block uppercase text-[10px]">
              User ID
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px] mt-0.5 block truncate">
              {user?.id || "local-user-session"}
            </span>
          </div>
        </div>
      </div>

      {/* Interface Appearance Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
              {isDark ? <Moon className="w-5 h-5 text-teal-600 dark:text-teal-400" /> : <Sun className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">Theme &amp; Appearance</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Toggle dark mode and customize visual preferences</span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-semibold capitalize">
            {theme} Mode
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div>
            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">Color Palette</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-contrast marine dark palette tailored for low-light fieldwork and OLED displays
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                !isDark
                  ? "bg-white border-teal-500 text-teal-800 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? "bg-teal-950/80 border-teal-400 text-teal-300 shadow-2xs"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Infrastructure Connection Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Database className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Infrastructure Connectivity</span>
          </div>

          <button
            onClick={checkApiHealth}
            className="text-xs text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${apiStatus === "checking" ? "animate-spin" : ""}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">PostgreSQL / PostGIS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100">Live (Port 6543)</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">AWS ap-southeast-2</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Storage Bucket</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100">seagrass-images</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Public CDN Enabled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">FastAPI Engine</span>
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
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {apiStatus === "online" ? "Online (v0.1.0)" : apiStatus === "checking" ? "Testing..." : "Offline"}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">http://localhost:8000</div>
          </div>
        </div>
      </div>

      {/* Field Simulation Defaults Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm">
          <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Default Simulation Parameters</span>
        </div>

        <form onSubmit={handleSaveDefaults} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Default Water Depth (m)
              </label>
              <input
                type="number"
                step="0.1"
                value={defaultDepth}
                onChange={(e) => setDefaultDepth(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-teal-500"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Standard baseline depth for quick scans (default: 1.5m)
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Default Incident Wave Height (m)
              </label>
              <input
                type="number"
                step="0.05"
                value={defaultWaveHeight}
                onChange={(e) => setDefaultWaveHeight(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-teal-500"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                Offshore swell baseline (default: 0.80m)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
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
      <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">Session Control</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sign out of this user session on this device.</span>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
