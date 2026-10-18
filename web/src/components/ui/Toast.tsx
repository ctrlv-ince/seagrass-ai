import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    cardStyle: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    cardStyle: "bg-white border-emerald-200 text-slate-800 shadow-lg shadow-emerald-500/10",
    iconColor: "text-emerald-600 bg-emerald-50",
    titleColor: "text-emerald-950",
  },
  error: {
    icon: AlertCircle,
    cardStyle: "bg-white border-rose-200 text-slate-800 shadow-lg shadow-rose-500/10",
    iconColor: "text-rose-600 bg-rose-50",
    titleColor: "text-rose-950",
  },
  warning: {
    icon: AlertTriangle,
    cardStyle: "bg-white border-amber-200 text-slate-800 shadow-lg shadow-amber-500/10",
    iconColor: "text-amber-600 bg-amber-50",
    titleColor: "text-amber-950",
  },
  info: {
    icon: Info,
    cardStyle: "bg-white border-teal-200 text-slate-800 shadow-lg shadow-teal-500/10",
    iconColor: "text-teal-600 bg-teal-50",
    titleColor: "text-teal-950",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newItem: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "success" }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "error" }),
    [toast]
  );
  const warning = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "warning" }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ title, description, variant: "info" }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}

      {/* Accessible Fixed Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((item) => {
            const config = VARIANT_CONFIG[item.variant || "info"];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                role="status"
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`pointer-events-auto rounded-xl border p-3.5 flex items-start gap-3 ${config.cardStyle}`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${config.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className={`text-xs font-semibold leading-tight ${config.titleColor}`}>
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {item.description}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
