import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { TrustSignals } from "../components/landing/TrustSignals";
import { Stats } from "../components/landing/Stats";
import { Features } from "../components/landing/Features";
import { InteractiveDemo } from "../components/landing/InteractiveDemo";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative">
      {/* Accessible Keyboard Skip to Content Link */}
      <a
        href="#landing-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-teal-700 focus:text-white focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-teal-400 focus:text-xs focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="landing-content" tabIndex={-1} className="flex-grow focus:outline-none">
        <Hero />
        <TrustSignals />
        <Stats />
        <Features />
        <InteractiveDemo />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
