import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";
import { SeagrassLogo } from "../common/SeagrassLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (window.scrollY / totalHeight) * 100)
        );
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-lg"
          >
            <SeagrassLogo size="md" variant="full" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-teal-600 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-md"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-teal-600 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-md"
            >
              How It Works
            </a>
            <a
              href="#specs"
              className="hover:text-teal-600 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-md"
            >
              Seagrass Specs
            </a>
            <a
              href="#wave-impact"
              className="hover:text-teal-600 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-md"
            >
              Wave Attenuation
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"
              aria-label={mobileMenuOpen ? "Close Navigation" : "Toggle Navigation"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      {/* Animated Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-teal-600 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-teal-600 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#specs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-teal-600 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Seagrass Specs
                </a>
                <a
                  href="#wave-impact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-teal-600 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Wave Attenuation
                </a>
              </nav>

              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                {user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full py-2.5 text-center font-medium bg-teal-600 text-white rounded-xl shadow-xs"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
