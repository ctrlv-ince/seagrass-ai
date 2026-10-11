import React from "react";
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from "react-native";
import { colors, fontSize, fontWeight } from "@/theme";

export type TextVariant =
  | "hero"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "label";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof fontWeight;
}

export function Text({
  variant = "body",
  color,
  weight,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[
        styles[variant],
        color ? { color } : undefined,
        weight ? { fontWeight: fontWeight[weight] } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  hero: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.text,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
});
