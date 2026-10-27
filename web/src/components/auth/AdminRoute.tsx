import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, ShieldAlert, ArrowLeft, KeyRound } from "lucide-react";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin, role, setDemoRole, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d17] flex flex-col items-center justify-center text-emerald-400">
        <Loader2 className="w-9 h-9 animate-spin mb-3 text-emerald-400" />
        <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
          Validating Security Clearance...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070d18] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0d1829]/80 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-red-950/40 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5 text-red-400 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Restricted Access (403)
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            This module requires <span className="text-red-400 font-semibold uppercase tracking-wider text-xs">Administrator</span> clearance.
            Your current account role is <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{role}</span>.
          </p>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>

            {!isConfigured && (
              <button
                type="button"
                onClick={() => setDemoRole("admin")}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-900/30 border border-emerald-400/30"
              >
                <KeyRound className="w-4 h-4" />
                Enable Demo Admin Privileges
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
