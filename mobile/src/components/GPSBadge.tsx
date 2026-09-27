/**
 * GPS badge component showing current location status.
 */
import { View, Text, StyleSheet } from "react-native";

interface GPSBadgeProps {
  isActive: boolean;
  accuracy?: number;
}

export function GPSBadge({ isActive, accuracy }: GPSBadgeProps) {
  return (
    <View style={[styles.badge, isActive ? styles.active : styles.inactive]}>
      <Text style={styles.icon}>{isActive ? "📍" : "📌"}</Text>
      <Text style={styles.text}>
        {isActive
          ? `GPS ±${accuracy?.toFixed(0) ?? "?"}m`
          : "GPS Off"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  active: {
    backgroundColor: "#d1fae5",
  },
  inactive: {
    backgroundColor: "#fef3c7",
  },
  icon: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
