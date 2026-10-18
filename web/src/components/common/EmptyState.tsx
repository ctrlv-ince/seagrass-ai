import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface ActionConfig {
  label: string;
  onClick?: () => void;
  to?: string;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ActionConfig;
  secondaryAction?: ActionConfig;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-10 sm:p-14 text-center rounded-3xl border border-dashed border-slate-200/90 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/60 flex items-center justify-center mb-3 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {action &&
            (action.to ? (
              <Link
                to={action.to}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </button>
            ))}

          {secondaryAction &&
            (secondaryAction.to ? (
              <Link
                to={secondaryAction.to}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors shadow-2xs"
              >
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
              >
                <span>{secondaryAction.label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
