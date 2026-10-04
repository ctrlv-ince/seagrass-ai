import React from "react";
import { Link } from "react-router-dom";
import { Waves, ArrowLeft, ShieldCheck, Scan, Ruler } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row">
      
      {/* Left visual pane (desktop 55%) */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-gradient-to-br from-teal-50/80 via-slate-50 to-cyan-50/70 p-12 flex-col justify-between overflow-hidden border-r border-slate-200">
        
        {/* Soft background glow */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-teal-200/30 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/30 blur-[90px] rounded-full pointer-events-none" />

        {/* Top Header / Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  SEAGRASS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 rounded">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                SPECS & WAVE ATTENUATION
              </span>
            </div>
          </Link>
        </div>

        {/* Center Seagrass Showcase Card */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-semibold mb-4">
            <Scan className="w-3.5 h-3.5 text-teal-600" />
            <span>INSTANT MEADOW EXTRACTION</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-950 leading-tight tracking-tight">
            Accurate seagrass parameters & hydrodynamic dampening
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Upload field photos or survey quadrats to extract species composition, density coverage, and blade canopy height, then instantly model nearshore wave height decay.
          </p>

          {/* Telemetry card preview */}
          <div className="mt-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-800">
                <Waves className="w-4 h-4 text-teal-600" />
                <span>MEADOW ANALYSIS PREVIEW</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Processed
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">SPECIES</span>
                <span className="font-bold text-teal-700 italic">E. acoroides</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">COVERAGE</span>
                <span className="font-bold text-slate-900 font-mono">76.5%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">WAVE DAMPENING</span>
                <span className="font-bold text-cyan-700 font-mono">-58.4%</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-teal-600" />
                Average Blade Length: 28.5 cm
              </span>
              <span className="font-mono">Depth: 1.8 m</span>
            </div>
          </div>
        </div>

        {/* Footer of Left Pane */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Secure authentication & protected user sessions
          </span>
          <span>v2026.1</span>
        </div>

      </div>

      {/* Right Form Pane (mobile full width, lg 45%) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-12 lg:p-14 bg-white">
        {/* Top bar with back to home */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-teal-700 transition-colors py-1 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          {/* Mobile brand visible only on small screens */}
          <div className="lg:hidden flex items-center space-x-2">
            <Waves className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-bold text-slate-900">SEAGRASS AI</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Bottom security note */}
        <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-100">
          Protected session. By proceeding, you agree to the Terms of Service.
        </div>
      </div>

    </div>
  );
}
