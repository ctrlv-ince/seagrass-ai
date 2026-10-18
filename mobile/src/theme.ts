/**
 * Seagrass Mobile Design System
 *
 * Single source of truth for colors, spacing, typography, and radii.
 * Every screen imports from here instead of re-declaring inline values.
 */

export const colors = {
  // Backgrounds
  background: "#F8FAFB",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",
  surfaceTertiary: "#F8FAFC",

  // Brand
  primary: "#0D9488",
  primaryDark: "#0F766E",
  primaryLight: "#CCFBF1",
  primarySubtle: "#F0FDFA",
  accent: "#06B6D4",
  accentLight: "#ECFEFF",

  // Text
  text: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  textOnPrimary: "#FFFFFF",

  // Borders
  border: "#E2E8F0",
  borderLight: "#F1F5F9",

  // Semantic
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  error: "#DC2626",
  errorLight: "#FEF2F2",
  info: "#2563EB",
  infoLight: "#EFF6FF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 28,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
};

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  heavy: "Inter_800ExtraBold",
} as const;

export const shadow = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

const theme = { colors, spacing, radius, fontSize, fontWeight, fontFamily, shadow };
export default theme;
