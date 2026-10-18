import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  Zap,
} from "lucide-react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  // Real-time typewriter effect for species detection demonstration
  const targetSpecies = "Enhalus acoroides";
  const [displayedSpecies, setDisplayedSpecies] = useState(
    shouldReduceMotion ? targetSpecies : ""
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      if (index <= targetSpecies.length) {
        setDisplayedSpecies(targetSpecies.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 65);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-teal-50/70 via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Soft ambient lighting circles */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-teal-100/40 dark:bg-teal-950/30 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute top-36 right-10 w-[450px] h-[350px] bg-cyan-100/35 dark:bg-cyan-950/20 blur-[95px] rounded-full pointer-events-none" />

      {/* Floating subtle wave contours in background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-10 left-0 w-full h-[600px] text-teal-600/20"
          viewBox="0 0 1440 400"
          fill="none"
          role="presentation"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Badge with subtle glow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span>AI SEAGRASS ANALYSIS & HYDRODYNAMICS</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100 leading-[1.12]"
            >
              Scan Seagrass. Measure{" "}
              <span className="text-teal-600 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                Meadow Specs
              </span>{" "}
              &{" "}
              <span className="text-cyan-600 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-teal-600">
                Wave Impact
              </span>.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
            >
              Upload any seagrass photo or benthic survey image. Our YOLOv11 models identify species, calculate coverage density and blade length, and instantly compute nearshore wave attenuation and shoreline dampening.
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
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all duration-200 shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              >
                <span>Scan Seagrass Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#specs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
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
              className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Species & Density Classification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Blade Length & Canopy Structure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Wave Height & Energy Attenuation</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Telemetry Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-none p-6 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10">
              
              {/* Header of Telemetry Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                      SAMPLE SCAN #SG-4091
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Benthic Quadrat • Inshore Transect A</p>
                  </div>
                </div>

                {/* Pulsing Confidence Badge */}
                <div className="relative flex items-center">
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    96.8% Match
                  </span>
                </div>
              </div>

              {/* Seagrass Visual Scan Representation */}
              <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white relative overflow-hidden shadow-inner">
                {/* Background telemetry grid pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                    <Scan className="w-3.5 h-3.5" />
                    AI Detection Output
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Depth: 1.8 m
                  </span>
                </div>

                <div className="relative mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Identified Species
                    </span>
                    <div className="text-lg font-bold text-teal-200 italic min-h-[28px] flex items-center">
                      {displayedSpecies}
                      {displayedSpecies.length < targetSpecies.length && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-teal-400 animate-pulse" />
                      )}
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

                {/* Animated Density Bar (Framer Motion 0 -> 76.5%) */}
                <div className="relative mt-3.5 w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "76.5%" }}
                    transition={{
                      duration: 1.4,
                      delay: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 h-full rounded-full shadow-sm"
                  />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-700 transition-colors">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <Ruler className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Blade Length</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                    28.5 cm
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Average blade height</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-700 transition-colors">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <BarChart2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Shoot Density</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                    420 / m²
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Shoots per m² quadrat</span>
                </div>
              </div>

              {/* Wave Attenuation Impact Output Box */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-teal-950/40 dark:to-cyan-950/40 border border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase font-mono">
                        Wave Attenuation Impact
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Model Version: v2.1 Hydro</p>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold font-mono text-teal-700 dark:text-teal-300">
                    -58.4%
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-teal-200/60 dark:border-teal-800/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Incoming Wave Height</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">1.60 meters</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Dampened Inshore Height</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">0.67 meters</span>
                  </div>
                </div>
              </div>

              {/* Trust footer */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Mendez-Losada (2004) physics engine
                </span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold">Runtime: 1.1s</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
