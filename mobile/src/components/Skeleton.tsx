import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height: height as any,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SurveySkeletonRow() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width={140} height={18} borderRadius={radius.sm} />
        <Skeleton width={65} height={20} borderRadius={radius.full} />
      </View>
      <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
        <Skeleton width={200} height={13} borderRadius={radius.sm} />
        <View style={styles.metaRow}>
          <Skeleton width={80} height={12} borderRadius={radius.sm} />
          <Skeleton width={70} height={12} borderRadius={radius.sm} />
          <Skeleton width={85} height={12} borderRadius={radius.sm} />
        </View>
      </View>
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={100} height={14} borderRadius={radius.sm} />
      <Skeleton width={160} height={24} borderRadius={radius.md} style={{ marginTop: 10 }} />
      <Skeleton width={80} height={12} borderRadius={radius.sm} style={{ marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: 4,
  },
});
