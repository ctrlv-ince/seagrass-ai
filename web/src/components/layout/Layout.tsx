import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LayoutProvider } from "../../context/LayoutContext";

type Props = {
  children?: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <LayoutProvider>
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
        {/* Accessible Keyboard Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-teal-700 focus:text-white focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-teal-400 focus:text-xs focus:font-bold focus:outline-none"
        >
          Skip to main content
        </a>

        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            aria-label="Marine Telemetry Content"
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 focus:outline-none"
          >
            {children}
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
