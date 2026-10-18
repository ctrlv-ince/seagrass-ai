import { useState } from "react";
import { Link } from "react-router-dom";
import { Scan, Waves, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge";

interface SampleCase {
  id: string;
  label: string;
  species: string;
  commonName: string;
  coverage: number;
  bladeLength: number;
  density: number;
  waveDamping: number;
  incidentWave: number;
  inshoreWave: number;
  depth: number;
  gradient: string;
}

const SAMPLES: SampleCase[] = [
  {
    id: "enhalus",
    label: "Dense Ribbon Transect",
    species: "Enhalus acoroides",
    commonName: "Ribbon Seagrass",
    coverage: 78.5,
    bladeLength: 32.0,
    density: 460,
    waveDamping: 62.4,
    incidentWave: 1.6,
    inshoreWave: 0.60,
    depth: 1.8,
    gradient: "from-teal-900 via-emerald-950 to-slate-950",
  },
  {
    id: "thalassia",
    label: "Reef Flat Turtle Grass",
    species: "Thalassia hemprichii",
    commonName: "Turtle Grass",
    coverage: 58.2,
    bladeLength: 18.5,
    density: 680,
    waveDamping: 48.0,
    incidentWave: 1.4,
    inshoreWave: 0.73,
    depth: 1.2,
    gradient: "from-cyan-950 via-teal-950 to-slate-950",
  },
  {
    id: "halophila",
    label: "Pioneer Paddle Shoal",
    species: "Halophila ovalis",
    commonName: "Paddle Grass",
    coverage: 34.0,
    bladeLength: 4.2,
    density: 850,
    waveDamping: 24.5,
    incidentWave: 1.2,
    inshoreWave: 0.91,
    depth: 2.2,
    gradient: "from-blue-950 via-slate-900 to-slate-950",
  },
];

export function InteractiveDemo() {
  const [activeSample, setActiveSample] = useState<SampleCase>(SAMPLES[0]);

  return (
    <section id="demo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>INSTANT EXPLORER • NO ACCOUNT REQUIRED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Try the AI Seagrass Telemetry Demo
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Select sample benthic quadrat transects below to preview real-time AI species segmentation and hydrodynamic wave damping calculations.
          </p>

          {/* Sample Selectors */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => setActiveSample(sample)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSample.id === sample.id
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Interactive Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Simulated Quadrat View */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Scan className="w-4 h-4" />
                Live Camera Feed Simulator
              </span>
              <span className="text-slate-400">Depth: {activeSample.depth}m</span>
            </div>

            {/* Visual Meadow Canvas */}
            <div
              className={`my-6 rounded-xl bg-gradient-to-b ${activeSample.gradient} p-6 border border-teal-500/20 flex flex-col items-center justify-center min-h-[220px] relative`}
            >
              {/* 3x3 Grid Overlay */}
              <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/10" />
              </div>

              <div className="text-4xl mb-2">🌿</div>
              <p className="text-xs font-mono text-teal-200 font-bold uppercase tracking-wider">
                50 × 50 cm Quadrat Transect
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeSample.species} Canopy
              </p>

              {/* Bounding Box Indicator */}
              <div className="absolute top-4 left-4 bg-teal-500/20 border border-teal-400/80 rounded px-2 py-0.5 text-[10px] font-mono text-teal-300">
                AI Detected: 97.4% conf
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Standard: Seagrass-Watch</span>
              <span className="text-emerald-400 font-medium">Benthic Frame Locked</span>
            </div>
          </div>

          {/* Real-time Telemetry Calculations */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                    IDENTIFIED TAXA
                  </span>
                  <h3 className="text-xl font-bold text-white italic">
                    {activeSample.species}
                  </h3>
                  <p className="text-xs text-slate-400">{activeSample.commonName}</p>
                </div>
                <Badge variant="primary" size="md" dot pulse>
                  Optimal Health
                </Badge>
              </div>

              {/* Specs Metric Row */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Coverage %
                  </span>
                  <span className="text-xl font-bold font-mono text-teal-300">
                    {activeSample.coverage}%
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Blade Length
                  </span>
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {activeSample.bladeLength} cm
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Shoot Density
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-300">
                    {activeSample.density} /m²
                  </span>
                </div>
              </div>

              {/* Hydrodynamic Damping Result Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/80 to-cyan-950/80 border border-teal-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold font-mono text-slate-200 uppercase">
                      Wave Attenuation (Mendez-Losada)
                    </span>
                  </div>
                  <span className="text-lg font-extrabold font-mono text-teal-300">
                    -{activeSample.waveDamping}% Energy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-teal-500/20">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Offshore Wave Height:</span>
                    <span className="font-bold font-mono text-white">
                      {activeSample.incidentWave.toFixed(2)} m
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Shoreline Wave Height:</span>
                    <span className="font-bold font-mono text-teal-300">
                      {activeSample.inshoreWave.toFixed(2)} m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                Upload your own photos or survey drone imagery
              </span>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
              >
                <span>Launch Full Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
