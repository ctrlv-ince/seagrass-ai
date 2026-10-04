import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Stats } from "../components/landing/Stats";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
