import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
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
        <Skeleton width={140} height={18} borderRadius={6} />
        <Skeleton width={65} height={20} borderRadius={10} />
      </View>
      <View style={{ marginTop: 8, gap: 6 }}>
        <Skeleton width={200} height={13} borderRadius={4} />
        <View style={styles.metaRow}>
          <Skeleton width={80} height={12} borderRadius={4} />
          <Skeleton width={70} height={12} borderRadius={4} />
          <Skeleton width={85} height={12} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={100} height={14} borderRadius={4} />
      <Skeleton width={160} height={24} borderRadius={6} style={{ marginTop: 10 }} />
      <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#cbd5e1",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
});
