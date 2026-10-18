import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Waves,
  Scan,
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  icon: typeof Sparkles;
}

const STEPS: Step[] = [
  {
    id: "explore-species",
    title: "Explore Botanical Reference Catalog",
    description: "Browse Southeast Asian seagrass taxa, blade morphology, and bulk drag coefficients.",
    link: "/species",
    linkLabel: "View Catalog",
    icon: BookOpen,
  },
  {
    id: "try-wave-model",
    title: "Simulate Wave Attenuation",
    description: "Test Mendez & Losada physics presets and customize meadow width and blade density.",
    link: "/wave-model",
    linkLabel: "Open Simulator",
    icon: Waves,
  },
  {
    id: "test-detection",
    title: "Review Quadrat Detection Benchmarks",
    description: "Inspect YOLOv11 demo sample predictions, canopy coverage %, and shoot density.",
    link: "/detection",
    linkLabel: "View Detection",
    icon: Scan,
  },
  {
    id: "view-map",
    title: "Inspect Coastal GIS Survey Map",
    description: "Switch between Street, Satellite, and Ocean bathymetry layers for Pangasinan field stations.",
    link: "/map",
    linkLabel: "Open GIS Map",
    icon: MapPin,
  },
];

const STORAGE_KEY = "seagrass_quickstart_progress";
const COLLAPSED_STORAGE_KEY = "seagrass_quickstart_collapsed";

export function QuickStartChecklist() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps));
    } catch {
      // Ignore localStorage write errors
    }
  }, [completedSteps]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const progressPct = Math.round((completedSteps.length / STEPS.length) * 100);
  const isAllComplete = completedSteps.length === STEPS.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-200/60 dark:border-teal-800/60 p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-72 h-36 bg-gradient-to-bl from-teal-100/40 via-cyan-50/20 to-transparent dark:from-teal-900/20 dark:via-cyan-900/10 pointer-events-none rounded-tr-3xl" />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Interactive Onboarding Guide
              </h2>
              {isAllComplete && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Ready for Fieldwork
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore key telemetry and hydrodynamic simulation features.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              {completedSteps.length} of {STEPS.length} Completed
            </span>
            <span className="text-[10px] text-slate-400">{progressPct}% Complete</span>
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand checklist" : "Collapse checklist"}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step Items */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-2">
          {STEPS.map((step) => {
            const isDone = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? "bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 opacity-90"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer shrink-0"
                    title={isDone ? "Mark as incomplete" : "Mark as completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <h3
                        className={`text-xs font-semibold truncate ${
                          isDone ? "text-slate-500 line-through" : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <Link
                  to={step.link}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline shrink-0 pt-0.5"
                >
                  <span>{step.linkLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
