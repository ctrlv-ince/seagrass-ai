import { motion } from "framer-motion";
import { Upload, Scan, Waves } from "lucide-react";
import { Link } from "react-router-dom";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload or Scan Image",
      subtitle: "Photos or Quadrat Samples",
      description:
        "Upload a photo of a seagrass patch, transect, or quadrat taken from your phone or camera with optional GPS coordinates.",
      icon: Upload,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      num: "02",
      title: "Extract Meadow Specs",
      subtitle: "Species, Density & Height",
      description:
        "The computer vision model identifies the seagrass species, measures percentage coverage density, and estimates average blade length.",
      icon: Scan,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      num: "03",
      title: "Get Wave Attenuation",
      subtitle: "Hydrodynamic Dampening",
      description:
        "The system calculates coastal wave energy dissipation and dampened inshore wave height, showing the physical wave reduction provided by the meadow.",
      icon: Waves,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <span>SIMPLE WORKFLOW</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works in 3 Steps
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            From raw seagrass photo to full meadow specs and wave impact calculations in under 2 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="bg-slate-50/80 rounded-2xl p-7 border border-slate-200 hover:border-teal-300 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono text-slate-300">
                      {step.num}
                    </span>
                    <div className={`p-3 rounded-xl border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  
                  <span className="mt-1 block text-xs font-semibold text-teal-700">
                    {step.subtitle}
                  </span>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>STEP {step.num}</span>
                  <span className="text-teal-700 font-medium">Automatic</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-50 p-8 sm:p-10 border border-teal-200 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="text-2xl font-bold text-slate-900">
            Ready to test your first seagrass scan?
          </h3>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
            Create an account to upload images, view meadow specs, and model wave dampening.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-lg font-medium text-sm text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
