import { Link } from "react-router-dom";
import { SeagrassLogo } from "../common/SeagrassLogo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-14 pb-10 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          
          {/* Brand info */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center group">
              <SeagrassLogo size="sm" variant="full" showSubtitle={false} />
            </Link>
            
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Fast, reliable seagrass scanning to extract meadow parameters, species, and canopy coverage, and calculate nearshore wave attenuation impact.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-teal-700 transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link to="/surveys" className="hover:text-teal-700 transition-colors">
                  Survey Logbook
                </Link>
              </li>
              <li>
                <Link to="/detection" className="hover:text-teal-700 transition-colors">
                  Seagrass Scanner
                </Link>
              </li>
              <li>
                <Link to="/wave-model" className="hover:text-teal-700 transition-colors">
                  Wave Attenuation Model
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-teal-700 transition-colors">
                  Spatial Map View
                </Link>
              </li>
              <li>
                <Link to="/species" className="hover:text-teal-700 transition-colors">
                  Species Field Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Specs & Features */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase mb-3">
              Specs & Physics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#specs" className="hover:text-teal-700 transition-colors">
                  Species Identification
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-teal-700 transition-colors">
                  Canopy Density & Blade Height
                </a>
              </li>
              <li>
                <a href="#wave-impact" className="hover:text-teal-700 transition-colors">
                  Wave Energy Dissipation
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-teal-700 transition-colors">
                  Quadrat Sampling Workflow
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-teal-700 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-700 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Seagrass AI. All rights reserved.</p>
          <p>Seagrass scanning & hydrodynamic wave dampening analysis.</p>
        </div>
      </div>
    </footer>
  );
}
