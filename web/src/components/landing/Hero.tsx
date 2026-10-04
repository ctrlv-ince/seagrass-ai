import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Waves,
  ArrowRight,
  ChevronRight,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Ruler,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-teal-50/60 via-slate-50/50 to-white overflow-hidden">
      {/* Soft ambient lighting circles */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-100/50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-cyan-100/40 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI SEAGRASS ANALYSIS & HYDRODYNAMICS</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]"
            >
              Scan Seagrass. Measure{" "}
              <span className="text-teal-600">Meadow Specs</span> &{" "}
              <span className="text-cyan-600">Wave Impact</span>.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed"
            >
              Upload any seagrass photo or survey image. Our AI models identify species, calculate coverage density and blade length, and instantly compute nearshore wave attenuation and shoreline dampening.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all duration-200 shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Scan Seagrass Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#specs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>View Sample Specs</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </a>
            </motion.div>

            {/* Quick Feature Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-slate-200 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Species & Density Classification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Blade Length & Canopy Structure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Wave Height & Energy Attenuation</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Clean Light Telemetry Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 overflow-hidden">
              
              {/* Header of Telemetry Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                      SAMPLE SCAN #SG-4091
                    </h3>
                    <p className="text-[11px] text-slate-500">Benthic Quadrat • Inshore Transect A</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  96.8% Match
                </span>
              </div>

              {/* Seagrass Visual Scan Representation */}
              <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <Scan className="w-3.5 h-3.5" />
                    AI Detection Output
                  </span>
                  <span className="text-[11px] text-slate-400">Depth: 1.8 m</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Identified Species
                    </span>
                    <div className="text-lg font-bold text-teal-200 italic">
                      Enhalus acoroides
                    </div>
                    <span className="text-xs text-slate-300">Ribbon Seagrass</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Canopy Density
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-white">
                      76.5%
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Dense Canopy</span>
                  </div>
                </div>

                {/* Density Bar */}
                <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-[76.5%] rounded-full"></div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Ruler className="w-3.5 h-3.5 text-teal-600" />
                    <span>Blade Length</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 font-mono">
                    28.5 cm
                  </div>
                  <span className="text-[10px] text-slate-500">Average blade height</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <BarChart2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Shoot Density</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 font-mono">
                    420 / m²
                  </div>
                  <span className="text-[10px] text-slate-500">Shoots per m² quadrat</span>
                </div>
              </div>

              {/* Wave Attenuation Impact Output Box */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-cyan-50/80 to-teal-50/80 border border-teal-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-600 text-white">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">
                        Wave Attenuation Impact
                      </h4>
                      <p className="text-[11px] text-slate-600">Model Version: v2.1 Hydro</p>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold font-mono text-teal-700">
                    -58.4%
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-teal-200/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Incoming Wave Height</span>
                    <span className="font-semibold text-slate-800 font-mono">1.60 meters</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">Dampened Inshore Height</span>
                    <span className="font-bold text-teal-700 font-mono">0.67 meters</span>
                  </div>
                </div>
              </div>

              {/* Trust footer */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Hydrodynamic attenuation physics model
                </span>
                <span className="font-mono">Runtime: 1.1s</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
