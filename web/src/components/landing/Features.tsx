import { motion } from "framer-motion";
import {
  Scan,
  Waves,
  Ruler,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-slate-100 tracking-tight">
            Scan seagrass. Get instant specs &amp; wave attenuation.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A specialized system designed to analyze seagrass meadows from raw image scans and compute coastal wave protection in seconds.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bento Item 1: 7 cols - Seagrass Specs Extraction */}
          <motion.div
            id="specs"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                  <Scan className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                  AI SPECS DETECTION
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Automated Seagrass Specs Extraction
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                  Upload an image of a quadrat or meadow. The AI model immediately isolates the seagrass from substrate, calculates percentage canopy cover, identifies the species, and estimates blade length.
                </p>
              </div>
            </div>

            {/* Spec breakdown visualization */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>DETECTED MEADOW PARAMETERS</span>
                <span className="text-teal-600 dark:text-teal-400">Model: YOLOv8-Seagrass</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">SPECIES</span>
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-300 italic">Enhalus acoroides</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Ribbon seagrass</span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">CANOPY COVERAGE</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">76.5%</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Dense meadow</span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">BLADE LENGTH</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">28.5 cm</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Average canopy height</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: 5 cols - Wave Attenuation Prediction */}
          <motion.div
            id="wave-impact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-cyan-300 dark:hover:border-cyan-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                  <Waves className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-700 dark:text-cyan-300 uppercase bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800">
                  WAVE PHYSICS
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Wave Attenuation Impact
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Calculate the exact hydrodynamic dampening provided by the scanned seagrass canopy under current water depth and incoming wave height.
                </p>
              </div>
            </div>

            {/* Wave Height Dampening Demonstration */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50/50 dark:from-teal-950/40 dark:to-cyan-950/40 border border-cyan-200 dark:border-teal-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <TrendingDown className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                  <span>Energy Dissipation</span>
                </div>
                <span className="text-lg font-extrabold font-mono text-cyan-700 dark:text-cyan-300">
                  -58.4%
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Incoming Wave</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">1.60 m</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <span className="text-cyan-700 dark:text-cyan-300 text-[10px] block font-medium">Inshore Dampened</span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300 font-mono text-sm">0.67 m</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: 5 cols - Survey Transects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                  <Ruler className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                  SURVEY SAMPLES
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Transect &amp; Quadrat Logging
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Log your surveys with GPS coordinates, transect lines, and individual quadrat sampling points. Keep a structured record of all meadow measurements.
                </p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transect Length:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">50 meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Quadrat Interval:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Every 5 m (10 samples)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Average Water Depth:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">1.8 meters</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 4: 7 cols - Instant Reports & Exports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  REPORTS &amp; EXPORTS
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Clear Summary Reports &amp; Raw Data
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Review complete analysis summaries, download raw parameter JSON, or export clean survey reports containing meadow density, species, and wave dissipation charts.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  PDF Summary Reports
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  JSON &amp; CSV Export
                </span>
              </div>

              <Link
                to="/register"
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1"
              >
                <span>Try scanning seagrass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
