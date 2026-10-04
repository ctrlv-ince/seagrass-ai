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
    <section id="features" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Scan seagrass. Get instant specs & wave attenuation.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A specialized system designed to analyze seagrass meadows from raw image scans and compute coastal wave protection in seconds.
          </p>
        </div>

        {/* Bento Grid (Light theme) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bento Item 1: 7 cols - Seagrass Specs Extraction */}
          <motion.div
            id="specs"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
                  <Scan className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  AI SPECS DETECTION
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-bold text-slate-900">
                  Automated Seagrass Specs Extraction
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-xl">
                  Upload an image of a quadrat or meadow. The AI model immediately isolates the seagrass from substrate, calculates percentage canopy cover, identifies the species, and estimates blade length.
                </p>
              </div>
            </div>

            {/* Spec breakdown visualization */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-slate-700 pb-2 border-b border-slate-200 flex items-center justify-between">
                <span>DETECTED MEADOW PARAMETERS</span>
                <span className="text-teal-600">Model: YOLOv8-Seagrass</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">SPECIES</span>
                  <span className="text-sm font-bold text-teal-700 italic">Enhalus acoroides</span>
                  <span className="text-[10px] text-slate-500 block">Ribbon seagrass</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">CANOPY COVERAGE</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">76.5%</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Dense meadow</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">BLADE LENGTH</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">28.5 cm</span>
                  <span className="text-[10px] text-slate-500 block">Average canopy height</span>
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
            className="lg:col-span-5 bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:border-cyan-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700">
                  <Waves className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-700 uppercase bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                  WAVE PHYSICS
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-bold text-slate-900">
                  Wave Attenuation Impact
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  Calculate the exact hydrodynamic dampening provided by the scanned seagrass canopy under current water depth and incoming wave height.
                </p>
              </div>
            </div>

            {/* Wave Height Dampening Demonstration */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50/50 border border-cyan-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <TrendingDown className="w-4 h-4 text-cyan-700" />
                  <span>Energy Dissipation</span>
                </div>
                <span className="text-lg font-extrabold font-mono text-cyan-700">
                  -58.4%
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Incoming Wave</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">1.60 m</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-cyan-200">
                  <span className="text-cyan-700 text-[10px] block font-medium">Inshore Dampened</span>
                  <span className="font-bold text-cyan-700 font-mono text-sm">0.67 m</span>
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
            className="lg:col-span-5 bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
                  <Ruler className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  SURVEY SAMPLES
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-bold text-slate-900">
                  Transect & Quadrat Logging
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  Log your surveys with GPS coordinates, transect lines, and individual quadrat sampling points. Keep a structured record of all meadow measurements.
                </p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Transect Length:</span>
                <span className="font-semibold text-slate-900">50 meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quadrat Interval:</span>
                <span className="font-semibold text-slate-900">Every 5 m (10 samples)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Water Depth:</span>
                <span className="font-semibold text-slate-900">1.8 meters</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 4: 7 cols - Instant Reports & Exports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  REPORTS & EXPORTS
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-bold text-slate-900">
                  Clear Summary Reports & Raw Data
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  Review complete analysis summaries, download raw parameter JSON, or export clean survey reports containing meadow density, species, and wave dissipation charts.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  PDF Summary Reports
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  JSON & CSV Export
                </span>
              </div>

              <Link
                to="/register"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
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
