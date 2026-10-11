import React from "react";
import { View, Text, StyleSheet, type ViewProps } from "react-native";
import { colors, radius, fontSize, fontWeight, spacing } from "@/theme";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; dot: string }
> = {
  default: {
    bg: colors.surfaceSecondary,
    text: colors.textSecondary,
    dot: colors.textTertiary,
  },
  primary: {
    bg: colors.primarySubtle,
    text: colors.primaryDark,
    dot: colors.primary,
  },
  success: {
    bg: colors.successLight,
    text: colors.success,
    dot: colors.success,
  },
  warning: {
    bg: colors.warningLight,
    text: colors.warning,
    dot: colors.warning,
  },
  error: {
    bg: colors.errorLight,
    text: colors.error,
    dot: colors.error,
  },
  info: {
    bg: colors.infoLight,
    text: colors.info,
    dot: colors.info,
  },
};

/**
 * Reusable Badge / Pill component adhering to theme tokens.
 */
export function Badge({
  label,
  variant = "default",
  size = "sm",
  dot = false,
  style,
  ...rest
}: BadgeProps) {
  const currentVariant = variantStyles[variant];
  const isSm = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentVariant.bg,
          paddingVertical: isSm ? 3 : 5,
          paddingHorizontal: isSm ? spacing.sm : spacing.md,
        },
        style,
      ]}
      {...rest}
    >
      {dot && (
        <View
          style={[styles.dot, { backgroundColor: currentVariant.dot }]}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: currentVariant.text,
            fontSize: isSm ? fontSize.xs : fontSize.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontWeight: fontWeight.medium,
  },
});
