import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  type ViewProps,
} from "react-native";
import { colors, radius, shadow } from "@/theme";

interface CardProps extends ViewProps {
  /** Subtle elevation — default "sm" */
  elevation?: "none" | "sm" | "md";
  /** Remove horizontal padding */
  flush?: boolean;
}

/**
 * Consistent surface card used across all screens.
 * Replaces the per-screen white-box-with-border pattern.
 */
export function Card({
  children,
  style,
  elevation = "sm",
  flush = false,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        elevation !== "none" && shadow[elevation],
        flush && styles.flush,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
  },
  flush: {
    paddingHorizontal: 0,
  },
});
