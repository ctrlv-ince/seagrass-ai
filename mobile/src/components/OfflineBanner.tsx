/**
 * Clean offline & sync status banner for field surveyors.
 * Adheres to theme tokens and uses vector icons.
 */
import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { WifiOff, RefreshCw, CloudUpload } from "lucide-react-native";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

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
        <View style={styles.contentRow}>
          <WifiOff size={14} color={colors.warning} />
          <Text style={styles.textOffline} numberOfLines={1}>
            Offline Mode
            {pendingCount > 0
              ? ` · ${pendingCount} survey items saved locally`
              : " · SQLite storage active"}
          </Text>
        </View>
      </View>
    );
  }

  // Online with pending sync items or active sync
  return (
    <View style={[styles.banner, styles.bannerSync]}>
      <View style={styles.syncRow}>
        <View style={styles.contentRow}>
          {isSyncing ? (
            <ActivityIndicator size="small" color={colors.primaryDark} />
          ) : (
            <CloudUpload size={15} color={colors.primaryDark} />
          )}
          <Text style={styles.textSync} numberOfLines={1}>
            {isSyncing
              ? "Syncing field records with cloud..."
              : `${pendingCount} item${pendingCount === 1 ? "" : "s"} ready to sync`}
          </Text>
        </View>
        {onSyncPress && !isSyncing && (
          <Pressable
            style={({ pressed }) => [
              styles.syncBtn,
              pressed && styles.syncBtnPressed,
            ]}
            onPress={onSyncPress}
          >
            <RefreshCw size={11} color={colors.surface} />
            <Text style={styles.syncBtnText}>Sync</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  bannerOffline: {
    backgroundColor: colors.warningLight,
    borderBottomColor: "#FDE68A",
  },
  bannerSync: {
    backgroundColor: colors.primaryLight,
    borderBottomColor: "#99F6E4",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textOffline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.warning,
    flexShrink: 1,
  },
  textSync: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  syncBtnPressed: {
    opacity: 0.8,
  },
  syncBtnText: {
    color: colors.surface,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
