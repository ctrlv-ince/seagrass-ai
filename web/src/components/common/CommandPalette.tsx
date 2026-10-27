import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  ClipboardList,
  Scan,
  Waves,
  MapPin,
  BookOpen,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Printer,
  Download,
  ArrowRight,
  Command,
  ShieldCheck,
  Users,
  Layers,
  TreePine,
  Cpu,
  BarChart3,
  FileText,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { downloadCSV, downloadPDF } from "../../lib/export";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Navigation" | "Actions" | "Admin";
  icon: typeof Search;
  shortcut?: string;
  onSelect: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();

  // Register global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to custom event to open palette from anywhere
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = useMemo(() => [
    {
      id: "nav-dashboard",
      title: "Dashboard",
      description: "Overview of meadow telemetry, recent scans, and wave attenuation",
      category: "Navigation",
      icon: LayoutDashboard,
      shortcut: "G D",
      onSelect: () => {
        navigate("/dashboard");
        setIsOpen(false);
      },
    },
    {
      id: "nav-detection",
      title: "Quadrat Detection",
      description: "AI-assisted species identification and canopy coverage analysis",
      category: "Navigation",
      icon: Scan,
      shortcut: "G Q",
      onSelect: () => {
        navigate("/detection");
        setIsOpen(false);
      },
    },
    {
      id: "nav-wave",
      title: "Wave Damping Simulator",
      description: "Mendez & Losada hydrodynamic decay model and scenario comparison",
      category: "Navigation",
      icon: Waves,
      shortcut: "G W",
      onSelect: () => {
        navigate("/wave-model");
        setIsOpen(false);
      },
    },
    {
      id: "nav-map",
      title: "Coastal GIS Map",
      description: "Interactive Leaflet map with satellite and bathymetry layers",
      category: "Navigation",
      icon: MapPin,
      shortcut: "G M",
      onSelect: () => {
        navigate("/map");
        setIsOpen(false);
      },
    },
    {
      id: "nav-species",
      title: "Species Reference Catalog",
      description: "Botanical taxonomy, shoot density, and drag coefficients",
      category: "Navigation",
      icon: BookOpen,
      shortcut: "G S",
      onSelect: () => {
        navigate("/species");
        setIsOpen(false);
      },
    },
    {
      id: "nav-surveys",
      title: "Surveys & Transects",
      description: "Manage marine field survey sessions and quadrat imagery",
      category: "Navigation",
      icon: ClipboardList,
      onSelect: () => {
        navigate("/surveys");
        setIsOpen(false);
      },
    },
    {
      id: "nav-settings",
      title: "Preferences & Settings",
      description: "Theme preferences, credentials, and default simulation parameters",
      category: "Navigation",
      icon: SettingsIcon,
      onSelect: () => {
        navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      id: "act-theme",
      title: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: `Toggle application color palette (${isDark ? "currently Dark" : "currently Light"})`,
      category: "Actions",
      icon: isDark ? Sun : Moon,
      shortcut: "T",
      onSelect: () => {
        toggleTheme();
        setIsOpen(false);
      },
    },
    {
      id: "act-print",
      title: "Print Current View / Report",
      description: "Open browser print dialogue or save as PDF",
      category: "Actions",
      icon: Printer,
      shortcut: "⌘P",
      onSelect: () => {
        setIsOpen(false);
        setTimeout(() => window.print(), 100);
      },
    },
    {
      id: "act-export-species",
      title: "Export Species Catalog (CSV)",
      description: "Download CSV spreadsheet of all Southeast Asian seagrass taxa",
      category: "Actions",
      icon: Download,
      onSelect: () => {
        setIsOpen(false);
        const sampleSpecies = [
          { "Scientific Name": "Enhalus acoroides", "Common Name": "Tropical Ribbon Grass", "Drag Coefficient": 0.85, "Damping Tier": "Very High" },
          { "Scientific Name": "Thalassia hemprichii", "Common Name": "Pacific Turtle Grass", "Drag Coefficient": 0.75, "Damping Tier": "High" },
          { "Scientific Name": "Halophila ovalis", "Common Name": "Paddle Grass", "Drag Coefficient": 0.50, "Damping Tier": "Moderate" },
          { "Scientific Name": "Cymodocea serrulata", "Common Name": "Serrated Ribbon", "Drag Coefficient": 0.65, "Damping Tier": "Moderate" },
          { "Scientific Name": "Syringodium isoetifolium", "Common Name": "Syringodium", "Drag Coefficient": 0.60, "Damping Tier": "Moderate" },
        ];
        downloadCSV(sampleSpecies, "seagrass-species-catalog.csv");
      },
    },
    {
      id: "act-export-species-pdf",
      title: "Export Species Catalog (PDF)",
      description: "Download styled PDF reference guide of Southeast Asian seagrass taxa",
      category: "Actions",
      icon: FileText,
      onSelect: async () => {
        setIsOpen(false);
        const sampleSpecies = [
          { "Scientific Name": "Enhalus acoroides", "Common Name": "Tropical Ribbon Grass", "Drag Coefficient": "0.85", "Damping Tier": "Very High" },
          { "Scientific Name": "Thalassia hemprichii", "Common Name": "Pacific Turtle Grass", "Drag Coefficient": "0.75", "Damping Tier": "High" },
          { "Scientific Name": "Halophila ovalis", "Common Name": "Paddle Grass", "Drag Coefficient": "0.50", "Damping Tier": "Moderate" },
          { "Scientific Name": "Cymodocea serrulata", "Common Name": "Serrated Ribbon", "Drag Coefficient": "0.65", "Damping Tier": "Moderate" },
          { "Scientific Name": "Syringodium isoetifolium", "Common Name": "Syringodium", "Drag Coefficient": "0.60", "Damping Tier": "Moderate" },
        ];
        await downloadPDF({
          filename: "seagrass-species-catalog",
          title: "Seagrass Species Reference Guide",
          subtitle: "Field taxonomy and hydrodynamic attenuation characteristics.",
          orientation: "landscape",
          tables: [
            {
              title: "Southeast Asian Seagrass Reference Catalog",
              rows: sampleSpecies,
            },
          ],
        });
      },
    },
    ...(isAdmin
      ? ([
          {
            id: "admin-dashboard",
            title: "Admin: Platform Operations",
            description: "View telemetry, analytics, and infrastructure health",
            category: "Admin",
            icon: ShieldCheck,
            shortcut: "G A",
            onSelect: () => {
              navigate("/admin");
              setIsOpen(false);
            },
          },
          {
            id: "admin-users",
            title: "Admin: User Directory",
            description: "Manage registered user accounts, roles, and privileges",
            category: "Admin",
            icon: Users,
            shortcut: "G U",
            onSelect: () => {
              navigate("/admin/users");
              setIsOpen(false);
            },
          },
          {
            id: "admin-surveys",
            title: "Admin: Survey Repository",
            description: "Oversee global field surveys, bulk status updates, and deletions",
            category: "Admin",
            icon: Layers,
            onSelect: () => {
              navigate("/admin/surveys");
              setIsOpen(false);
            },
          },
          {
            id: "admin-species",
            title: "Admin: Species Catalog CRUD",
            description: "Create, edit, and maintain reference species taxonomy",
            category: "Admin",
            icon: TreePine,
            onSelect: () => {
              navigate("/admin/species");
              setIsOpen(false);
            },
          },
          {
            id: "admin-reports",
            title: "Admin: Reports & Graphs",
            description: "Executive telemetry analytics, species composition, and CSV/PDF reports",
            category: "Admin",
            icon: BarChart3,
            shortcut: "G R",
            onSelect: () => {
              navigate("/admin/reports");
              setIsOpen(false);
            },
          },
          {
            id: "admin-system",
            title: "Admin: System Health Diagnostics",
            description: "Database, YOLO model, and cache runtime checks",
            category: "Admin",
            icon: Cpu,
            onSelect: () => {
              navigate("/admin/system");
              setIsOpen(false);
            },
          },
        ] as CommandItem[])
      : []),
  ], [navigate, isDark, toggleTheme, isAdmin]);

  const filteredCommands = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return commands;
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(term) ||
        cmd.description.toLowerCase().includes(term) ||
        cmd.category.toLowerCase().includes(term)
    );
  }, [commands, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.onSelect();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 no-print"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, pages, simulations, or shortcuts..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or pages found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">
                        {cmd.title}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {cmd.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200/60 dark:border-slate-700">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-white dark:bg-slate-800 border rounded font-mono">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-white dark:bg-slate-800 border rounded font-mono">↵</kbd> Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Seagrass Quick Access
          </span>
        </div>
      </div>
    </div>
  );
}
