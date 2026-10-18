import { useAuth } from "../../hooks/useAuth";
import { useLayoutSidebar } from "../../context/LayoutContext";
import { useTheme } from "../../context/ThemeContext";
import { Database, Bell, Search, ShieldCheck, Menu, Sun, Moon } from "lucide-react";

export function Header() {
  const { isConfigured } = useAuth();
  const { toggleMobileOpen } = useLayoutSidebar();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between text-slate-800">
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleMobileOpen}
          className="p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="relative flex items-center w-48 sm:w-72 md:w-80 pl-9 pr-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-left font-sans"
          title="Open Command Palette (Ctrl+K or ⌘K)"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <span className="truncate">Search commands or jump to...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-auto px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-500">PostGIS:</span>
          <span className="text-emerald-700 font-semibold">
            {isConfigured ? "Connected" : "Demo Sandbox"}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          title="Notifications"
          aria-label="View notifications"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
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
