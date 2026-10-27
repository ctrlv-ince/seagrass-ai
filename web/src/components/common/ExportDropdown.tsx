import React, { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from "lucide-react";

export interface ExportDropdownProps {
  onExportCSV: () => void | Promise<void>;
  onExportPDF: () => void | Promise<void>;
  isExporting?: boolean;
  label?: string;
  align?: "left" | "right";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExportCSV,
  onExportPDF,
  isExporting = false,
  label = "Export",
  align = "right",
  size = "sm",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectCSV = async () => {
    setIsOpen(false);
    await onExportCSV();
  };

  const handleSelectPDF = async () => {
    setIsOpen(false);
    await onExportPDF();
  };

  const isSmall = size === "sm";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled || isExporting}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs transition-all cursor-pointer ${
          isSmall ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm"
        } ${disabled || isExporting ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isExporting ? (
          <Loader2 className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} animate-spin text-teal-600`} />
        ) : (
          <Download className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} text-slate-500 dark:text-slate-400`} />
        )}
        <span>{isExporting ? "Exporting..." : label}</span>
        <ChevronDown
          className={`${isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl py-1.5 focus:outline-none animate-fadeIn ${
            align === "right" ? "right-0" : "left-0"
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
              Select Output Format
            </span>
          </div>

          <button
            type="button"
            onClick={handleSelectCSV}
            className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
            role="menuitem"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Spreadsheet (CSV)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Raw data for Excel or Python
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleSelectPDF}
            className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
            role="menuitem"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Analytical Report (PDF)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Visual charts &amp; styled tables
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
