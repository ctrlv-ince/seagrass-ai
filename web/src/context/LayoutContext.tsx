import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

interface LayoutContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const STORAGE_KEY = "seagrass_sidebar_collapsed";

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Persist desktop collapse state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isCollapsed]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);
  const toggleMobileOpen = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <LayoutContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileOpen,
        closeMobile,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutSidebar() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutSidebar must be used within a LayoutProvider");
  }
  return context;
}
