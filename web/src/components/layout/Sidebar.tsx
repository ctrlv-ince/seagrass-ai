import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLayoutSidebar } from "../../context/LayoutContext";
import {
  LayoutDashboard,
  ClipboardList,
  Scan,
  Waves,
  MapPin,
  LogOut,
  ExternalLink,
  BookOpen,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SeagrassLogo } from "../common/SeagrassLogo";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/detection", label: "Seagrass Scanner", icon: Scan },
  { to: "/wave-model", label: "Wave Attenuation", icon: Waves },
  { to: "/map", label: "Spatial Map", icon: MapPin },
  { to: "/species", label: "Species Guide", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    closeMobile,
  } = useLayoutSidebar();

  const handleSignOut = async () => {
    await signOut();
    closeMobile();
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        aria-label="Main Navigation"
        className={`hidden lg:flex flex-col justify-between h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-[width] duration-200 ease-in-out shrink-0 select-none ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Brand & Desktop Collapse Toggle */}
          <div
            className={`flex items-center border-b border-slate-100 dark:border-slate-800 ${
              isCollapsed ? "p-3 justify-center flex-col gap-2" : "p-4 justify-between"
            }`}
          >
            <Link
              to="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-lg"
              title="Seagrass AI Home"
            >
              <SeagrassLogo
                size="sm"
                variant={isCollapsed ? "icon" : "full"}
                showSubtitle={!isCollapsed}
              />
            </Link>

            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1" aria-label="Sidebar Menu">
            {!isCollapsed && (
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Platform Menu
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 ${
                      isCollapsed
                        ? "justify-center p-3"
                        : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {!isCollapsed && (
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold text-xs"
                title={`${displayName} (${user?.email || "User"})`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 font-semibold text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {displayName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || "user@example.com"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE DRAWER OVERLAY & PANEL ── */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer slide-in panel */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between text-slate-700 dark:text-slate-200 z-10 animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-slate-800">
            <div>
              {/* Header with Logo and Close Button */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link to="/" onClick={closeMobile} className="flex items-center">
                  <SeagrassLogo size="sm" variant="full" />
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="p-3 space-y-1">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Platform Menu
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Profile & sign out in mobile drawer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 font-semibold text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {displayName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || "user@example.com"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
