import { ShieldCheck, Cpu, Database, Compass } from "lucide-react";

const RESEARCH_STANDARDS = [
  {
    icon: Cpu,
    title: "YOLOv11 Benthic Vision",
    desc: "Custom trained on multi-spectral benthic quadrat imagery with sub-species segmentation.",
  },
  {
    icon: Compass,
    title: "Mendez-Losada (2004)",
    desc: "Validated hydrodynamic physics for wave damping over flexible submerged aquatic vegetation.",
  },
  {
    icon: Database,
    title: "PostGIS Spatial Engine",
    desc: "Sub-meter polygon indexing and EPSG:4326 geospatial transect storage.",
  },
  {
    icon: ShieldCheck,
    title: "SeagrassNet Compatible",
    desc: "Standardized % coverage, shoot density, and blade length scientific schemas.",
  },
];

export function TrustSignals() {
  return (
    <section className="py-12 bg-slate-50/80 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-[11px] font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 font-semibold mb-1">
            SCIENTIFIC FOUNDATIONS &amp; TELEMETRY STANDARDS
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Built for Coastal Scientists, Conservationists &amp; Coastal Engineers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESEARCH_STANDARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
