import { useAuth } from "../../hooks/useAuth";
import { Database, Bell, Search, ShieldCheck } from "lucide-react";

export function Header() {
  const { isConfigured } = useAuth();

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between text-slate-800">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search surveys, quadrats, or species..."
            className="w-64 sm:w-80 pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/20 font-sans"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-500">PostGIS:</span>
          <span className="text-emerald-700 font-semibold">
            {isConfigured ? "Connected" : "Demo Sandbox"}
          </span>
        </div>

        <button
          title="Notifications"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5"></span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden md:inline">Protected Session</span>
        </div>
      </div>
    </header>
  );
}
