import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

export type ButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

export type LinkButtonProps = ButtonBaseProps &
  Omit<LinkProps, "to"> & {
    to: string;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md hover:shadow-teal-600/20 active:bg-teal-800 border border-transparent",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 active:bg-slate-300 border border-slate-200/80",
  outline:
    "bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 shadow-sm",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md hover:shadow-rose-600/20 active:bg-rose-800 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "px-5 py-2.5 text-base gap-2.5 rounded-xl font-semibold",
};

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | LinkButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconPosition = "left",
    label,
    children,
    fullWidth = false,
    className = "",
    disabled,
    ...rest
  },
  ref
) {
  const content = label || children;
  const isDisabled = disabled || loading;

  const combinedClasses = [
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerContent = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>
      )}
      {content && <span>{content}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  );

  if ("to" in rest && rest.to) {
    const { to, ...linkRest } = rest as LinkButtonProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={combinedClasses}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...linkRest}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={(rest as ButtonProps).type || "button"}
      className={combinedClasses}
      disabled={isDisabled}
      aria-busy={loading}
      {...(rest as ButtonProps)}
    >
      {innerContent}
    </button>
  );
});
