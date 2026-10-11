import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type PressableProps,
} from "react-native";
import { colors, radius, fontSize, fontWeight } from "@/theme";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Consistent button with primary/secondary/ghost variants.
 */
export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        isGhost && styles.ghost,
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
        style as any,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.textOnPrimary : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              sizeTextStyles[size],
              isPrimary && styles.labelPrimary,
              variant === "secondary" && styles.labelSecondary,
              isGhost && styles.labelGhost,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: fontWeight.semibold,
  },
  labelPrimary: {
    color: colors.textOnPrimary,
  },
  labelSecondary: {
    color: colors.text,
  },
  labelGhost: {
    color: colors.primary,
  },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingHorizontal: 12, paddingVertical: 8 },
  md: { paddingHorizontal: 16, paddingVertical: 12 },
  lg: { paddingHorizontal: 20, paddingVertical: 14 },
});

const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: fontSize.xs },
  md: { fontSize: fontSize.sm },
  lg: { fontSize: fontSize.md },
});
