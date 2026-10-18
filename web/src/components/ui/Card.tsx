import React, { type HTMLAttributes, type ReactNode } from "react";

export type CardElevation = "none" | "sm" | "md" | "lg";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  elevation?: CardElevation;
  padding?: CardPadding;
  hoverable?: boolean;
}

const elevationClasses: Record<CardElevation, string> = {
  none: "border border-slate-200/80 bg-white shadow-none",
  sm: "border border-slate-200/80 bg-white shadow-sm",
  md: "border border-slate-200/80 bg-white shadow-md shadow-slate-900/5",
  lg: "border border-slate-200/80 bg-white shadow-lg shadow-teal-900/5",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    subtitle,
    description,
    headerAction,
    footer,
    elevation = "sm",
    padding = "md",
    hoverable = false,
    className = "",
    children,
    ...rest
  },
  ref
) {
  const hasHeader = Boolean(title || subtitle || description || headerAction);

  return (
    <div
      ref={ref}
      className={[
        "rounded-2xl transition-all duration-200 overflow-hidden",
        elevationClasses[elevation],
        paddingClasses[padding],
        hoverable ? "hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5 hover:-translate-y-0.5" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {subtitle && (
              <p className="text-[11px] font-mono uppercase tracking-wider text-teal-700 font-semibold mb-0.5">
                {subtitle}
              </p>
            )}
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {children}

      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
});
