import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  ClipboardList,
  Scan,
  Waves,
  MapPin,
  LogOut,
  User,
  ExternalLink,
  BookOpen,
  Settings,
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between text-slate-700">
      <div>
        {/* Brand Link */}
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center group">
            <SeagrassLogo size="sm" variant="full" />
          </Link>
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
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-800 border border-teal-200 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-teal-600" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & actions at bottom */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-teal-700 hover:bg-slate-50 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {displayName}
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                {user?.email || "user@example.com"}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
