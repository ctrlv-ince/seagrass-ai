/**
 * GPS badge component showing current location status.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapPin, MapPinOff } from "lucide-react-native";
import { colors, radius, spacing, fontSize, fontWeight } from "@/theme";

interface GPSBadgeProps {
  isActive: boolean;
  accuracy?: number;
}

export function GPSBadge({ isActive, accuracy }: GPSBadgeProps) {
  return (
    <View style={[styles.badge, isActive ? styles.active : styles.inactive]}>
      {isActive ? (
        <MapPin size={12} color={colors.success} />
      ) : (
        <MapPinOff size={12} color={colors.warning} />
      )}
      <Text
        style={[
          styles.text,
          { color: isActive ? colors.success : colors.warning },
        ]}
      >
        {isActive
          ? `GPS ±${accuracy ? accuracy.toFixed(0) : "–"}m`
          : "GPS Off"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  active: {
    backgroundColor: colors.successLight,
  },
  inactive: {
    backgroundColor: colors.warningLight,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
