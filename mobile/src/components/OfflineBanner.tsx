/**
 * Interactive offline & sync status banner for field surveyors.
 * Shows connectivity status and queued SQLite records awaiting sync.
 */
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";

interface OfflineBannerProps {
  isOffline: boolean;
  pendingCount?: number;
  isSyncing?: boolean;
  onSyncPress?: () => void;
}

export function OfflineBanner({
  isOffline,
  pendingCount = 0,
  isSyncing = false,
  onSyncPress,
}: OfflineBannerProps) {
  // Hide if fully online and zero pending records
  if (!isOffline && pendingCount === 0 && !isSyncing) return null;

  if (isOffline) {
    return (
      <View style={[styles.banner, styles.bannerOffline]}>
        <Text style={styles.textOffline}>
          📶 Offline Mode{pendingCount > 0 ? ` · ${pendingCount} survey items saved to SQLite` : " · Local Storage Ready"}
        </Text>
      </View>
    );
  }

  // Online with pending sync items or active sync
  return (
    <View style={[styles.banner, styles.bannerSync]}>
      <View style={styles.syncRow}>
        <Text style={styles.textSync}>
          {isSyncing
            ? "🔄 Syncing field data with cloud server..."
            : `☁️ Online · ${pendingCount} survey items ready to sync`}
        </Text>
        {onSyncPress && !isSyncing && (
          <Pressable style={styles.syncBtn} onPress={onSyncPress}>
            <Text style={styles.syncBtnText}>Sync Now</Text>
          </Pressable>
        )}
        {isSyncing && <ActivityIndicator size="small" color="#0f766e" style={{ marginLeft: 8 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerOffline: {
    backgroundColor: "#fef3c7",
    borderBottomWidth: 1,
    borderBottomColor: "#fde68a",
  },
  textOffline: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
  },
  bannerSync: {
    backgroundColor: "#ccfbf1",
    borderBottomWidth: 1,
    borderBottomColor: "#99f6e4",
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textSync: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f766e",
    flex: 1,
  },
  syncBtn: {
    backgroundColor: "#0d9488",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  syncBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});
