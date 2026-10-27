import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
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
  ShieldCheck,
  Users,
  Layers,
  TreePine,
  Cpu,
  BarChart3,
  ArrowLeft,
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

const adminNavItems = [
  { to: "/admin", label: "Admin Overview", icon: ShieldCheck },
  { to: "/admin/users", label: "User Directory", icon: Users },
  { to: "/admin/surveys", label: "Survey Control", icon: Layers },
  { to: "/admin/species", label: "Species Catalog", icon: TreePine },
  { to: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin/system", label: "System Health", icon: Cpu },
] as const;

export function Sidebar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    closeMobile,
  } = useLayoutSidebar();

  const isAdminRoute = location.pathname.startsWith("/admin");

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
        {/* Brand Header */}
        <div
          className={`flex items-center shrink-0 border-b border-slate-100 dark:border-slate-800 ${
            isCollapsed ? "p-3 justify-center flex-col gap-2" : "p-4 justify-between"
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              to="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-lg"
              title="Seagrass AI Home"
            >
              <SeagrassLogo
                size="sm"
                variant={isCollapsed ? "icon" : "full"}
                showSubtitle={!isCollapsed && !isAdminRoute}
              />
            </Link>
            {!isCollapsed && isAdminRoute && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>

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

        {/* Scrollable Navigation Menu */}
        <nav
          className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1"
          aria-label="Sidebar Menu"
        >
          {isAdminRoute ? (
            /* ── ADMIN ROUTE NAVIGATION (ADMIN OPERATIONS ONLY) ── */
            <>
              {/* Return to User Platform Button */}
              <div className="mb-2">
                <Link
                  to="/dashboard"
                  title={isCollapsed ? "Return to User Platform" : undefined}
                  className={`flex items-center rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 transition-all ${
                    isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  {!isCollapsed && <span>Switch to Platform</span>}
                </Link>
              </div>

              {!isCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Admin Operations
                </div>
              )}

              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${
                        isCollapsed
                          ? "justify-center p-3"
                          : "gap-3 px-3 py-2.5"
                      } ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </>
          ) : (
            /* ── STANDARD PLATFORM NAVIGATION ── */
            <>
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

              {/* Clean Portal Switcher for Admins */}
              {isAdmin && (
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <NavLink
                    to="/admin"
                    title={isCollapsed ? "Switch to Admin Portal" : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${
                        isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      }`
                    }
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {!isCollapsed && <span>Switch to Admin Portal</span>}
                  </NavLink>
                </div>
              )}
            </>
          )}
        </nav>

        {/* User Profile & Actions (Pinned at bottom) */}
        <div className="shrink-0 p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-auto bg-white dark:bg-slate-900">
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
            {/* Header with Logo and Close Button */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Link to="/" onClick={closeMobile} className="flex items-center">
                  <SeagrassLogo size="sm" variant="full" />
                </Link>
                {isAdminRoute && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={closeMobile}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation items */}
            <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
              {isAdminRoute ? (
                <>
                  <div className="mb-2">
                    <Link
                      to="/dashboard"
                      onClick={closeMobile}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Switch to Platform</span>
                    </Link>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Admin Operations
                  </div>
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/admin"}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold"
                              : "text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </>
              ) : (
                <>
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

                  {isAdmin && (
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      <NavLink
                        to="/admin"
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          }`
                        }
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>Switch to Admin Portal</span>
                      </NavLink>
                    </div>
                  )}
                </>
              )}
            </nav>

            {/* Profile & sign out in mobile drawer (pinned at bottom) */}
            <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 mt-auto bg-white dark:bg-slate-900">
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
