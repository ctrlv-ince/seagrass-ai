/**
 * Offline status banner — shown when the device has no network connectivity.
 */
import { View, Text, StyleSheet } from "react-native";

interface OfflineBannerProps {
  isOffline: boolean;
  pendingCount?: number;
}

export function OfflineBanner({ isOffline, pendingCount = 0 }: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        📶 Offline mode{pendingCount > 0 ? ` · ${pendingCount} pending sync` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#fbbf24",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#78350f",
  },
});
