import React, { type HTMLAttributes, type ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  icon?: ReactNode;
  label?: string;
  children?: ReactNode;
}

const variantStyles: Record<
  BadgeVariant,
  { container: string; dot: string; text: string }
> = {
  default: {
    container:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700",
    dot: "bg-slate-400 dark:bg-slate-400",
    text: "text-slate-700 dark:text-slate-200",
  },
  primary: {
    container:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/80",
    dot: "bg-teal-600 dark:bg-teal-400",
    text: "text-teal-800 dark:text-teal-300",
  },
  success: {
    container:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    text: "text-emerald-800 dark:text-emerald-300",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80",
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-800 dark:text-amber-300",
  },
  error: {
    container:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80",
    dot: "bg-rose-600 dark:bg-rose-400",
    text: "text-rose-800 dark:text-rose-300",
  },
  info: {
    container:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80",
    dot: "bg-blue-600 dark:bg-blue-400",
    text: "text-blue-800 dark:text-blue-300",
  },
  outline: {
    container:
      "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    dot: "bg-teal-500",
    text: "text-slate-700 dark:text-slate-300",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1.5",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = "default",
    size = "sm",
    dot = false,
    pulse = false,
    icon,
    label,
    children,
    className = "",
    ...rest
  },
  ref
) {
  const current = variantStyles[variant];
  const content = label || children;

  return (
    <span
      ref={ref}
      className={[
        "inline-flex items-center font-medium rounded-full border transition-colors select-none",
        current.container,
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {content && <span>{content}</span>}
    </span>
  );
});
