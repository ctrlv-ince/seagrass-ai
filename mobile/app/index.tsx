import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import { OfflineBanner } from "@/components/OfflineBanner";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { getLocalSurveys, type LocalSurvey } from "@/db/repository";
import { colors, spacing, fontSize, fontWeight, radius, shadow } from "@/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { isSyncing, pendingCount, triggerSync, refreshPendingCount } =
    useOfflineSync();

  const [recentSurveys, setRecentSurveys] = useState<LocalSurvey[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      const data = await getLocalSurveys();
      setRecentSurveys(data.slice(0, 3));
      setTotalCount(data.length);
    } catch {
      setRecentSurveys([]);
      setTotalCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      refreshPendingCount();
    }, [loadData, refreshPendingCount])
  );

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Researcher";

  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.statusDot,
                isOnline ? styles.statusDotOnline : styles.statusDotOffline,
              ]}
            />
            <Pressable
              style={styles.avatarBtn}
              onPress={() => router.push("/settings")}
              accessibilityLabel="Settings"
            >
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Real-time offline banner */}
        <OfflineBanner
          isOffline={!isOnline}
          pendingCount={pendingCount}
          isSyncing={isSyncing}
          onSyncPress={triggerSync}
        />

        {/* ── Primary Action: Scan Seagrass ── */}
        <Pressable
          style={({ pressed }) => [
            styles.scanCard,
            pressed && styles.scanCardPressed,
          ]}
          onPress={() => router.push("/capture")}
        >
          <View style={styles.scanIconWrap}>
            <Camera size={24} color={colors.textOnPrimary} strokeWidth={2} />
          </View>
          <View style={styles.scanTextWrap}>
            <Text style={styles.scanTitle}>Scan Seagrass</Text>
            <Text style={styles.scanDesc}>
              Capture a quadrat photo to identify species and calculate wave
              attenuation
            </Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
        </Pressable>

        {/* ── Quick Stats ── */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>
              {totalCount > 0 ? totalCount : 18}
            </Text>
            <Text style={styles.statLabel}>Surveys</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>76.5%</Text>
            <Text style={styles.statLabel}>Avg coverage</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              -58%
            </Text>
            <Text style={styles.statLabel}>Wave damp</Text>
          </Card>
        </View>

        {/* ── Recent Surveys ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent surveys</Text>
          <Pressable onPress={() => router.replace("/survey")}>
            <Text style={styles.seeAllLink}>
              See all{totalCount > 0 ? ` (${totalCount})` : ""}
            </Text>
          </Pressable>
        </View>

        {recentSurveys.length > 0 ? (
          recentSurveys.map((s) => (
            <Pressable
              key={s.local_id}
              style={({ pressed }) => [
                styles.surveyRow,
                pressed && styles.surveyRowPressed,
              ]}
              onPress={() => router.push(`/survey/${s.local_id}`)}
            >
              <View style={styles.surveyDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.surveyTitle}>{s.title}</Text>
                <Text style={styles.surveySub}>
                  {s.location_name || "Coastline"} · {s.status}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textTertiary} />
            </Pressable>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No surveys yet. Scan a quadrat or log a field survey to get
              started.
            </Text>
            <Pressable
              style={styles.newSurveyBtn}
              onPress={() => router.push("/survey/new")}
            >
              <Text style={styles.newSurveyBtnText}>+ New survey</Text>
            </Pressable>
          </Card>
        )}
      </ScrollView>

      <BottomNavBar activeTab="home" />
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {},
  greeting: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOnline: {
    backgroundColor: colors.success,
  },
  statusDotOffline: {
    backgroundColor: colors.warning,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },

  /* ── Scan Card ── */
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.md,
  },
  scanCardPressed: {
    backgroundColor: colors.primaryDark,
  },
  scanIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTextWrap: {
    flex: 1,
  },
  scanTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textOnPrimary,
  },
  scanDesc: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
    lineHeight: 16,
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },

  /* ── Section header ── */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  seeAllLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },

  /* ── Recent survey rows ── */
  surveyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  surveyRowPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  surveyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  surveyTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  surveySub: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },

  /* ── Empty state ── */
  emptyCard: {
    alignItems: "center",
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  newSurveyBtn: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  newSurveyBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
  },
});
