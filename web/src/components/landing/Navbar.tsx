import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Waves, ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  SEAGRASS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 rounded">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                SPECS & WAVE ATTENUATION
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-teal-600 transition-colors py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-teal-600 transition-colors py-1"
            >
              How It Works
            </a>
            <a
              href="#specs"
              className="hover:text-teal-600 transition-colors py-1"
            >
              Seagrass Specs
            </a>
            <a
              href="#wave-impact"
              className="hover:text-teal-600 transition-colors py-1"
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
                  className="px-4 py-2 text-sm font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow transition-all group"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 py-1"
            >
              How It Works
            </a>
            <a
              href="#specs"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 py-1"
            >
              Seagrass Specs
            </a>
            <a
              href="#wave-impact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 py-1"
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
                className="w-full py-2.5 text-center font-medium bg-teal-600 text-white rounded-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-medium bg-teal-600 text-white rounded-lg shadow-sm"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
