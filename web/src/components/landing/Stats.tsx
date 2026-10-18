import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Waves, Scan, CheckCircle, Clock } from "lucide-react";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ from, to, duration = 2, decimals = 0, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * easeProgress;
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function Stats() {
  const stats = [
    {
      label: "Seagrass Scans Analyzed",
      value: 4280,
      suffix: "+",
      decimals: 0,
      icon: Scan,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800",
      description: "Field survey photos and quadrat samples classified.",
    },
    {
      label: "Species & Density Accuracy",
      value: 96.4,
      suffix: "%",
      decimals: 1,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800",
      description: "Validation against ground-truth benthic reference data.",
    },
    {
      label: "Average Wave Dissipation",
      value: 58.2,
      suffix: "%",
      decimals: 1,
      icon: Waves,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800",
      description: "Kinetic wave energy absorbed by seagrass canopies.",
    },
    {
      label: "Model Processing Speed",
      value: 1.2,
      suffix: "s",
      decimals: 1,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800",
      description: "Instant turnaround for specs and wave prediction results.",
    },
  ];

  return (
    <section id="stats" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
            RELIABLE &amp; INSTANT HYDRODYNAMIC SPECS
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Validated AI Accuracy with Fast Turnaround
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-700 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">METRICS</span>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    <AnimatedCounter
                      from={0}
                      to={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                    />
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.label}</h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
