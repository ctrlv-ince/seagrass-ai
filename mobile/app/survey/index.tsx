import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MapPin,
  ChevronRight,
  Plus,
  Layers,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getLocalSurveys } from "@/db/repository";
import { SurveySkeletonRow } from "@/components/Skeleton";
import { colors, spacing, fontSize, fontWeight, radius, shadow } from "@/theme";

interface SurveyItemDisplay {
  id: string;
  title: string;
  locationName: string;
  status: string;
  syncStatus?: "pending" | "synced" | "error";
}

const DEFAULT_SAMPLE_SURVEYS: SurveyItemDisplay[] = [
  {
    id: "1",
    title: "Bolinao Inshore Meadow",
    locationName: "Santiago Island, Pangasinan",
    status: "completed",
    syncStatus: "synced",
  },
  {
    id: "2",
    title: "Puerto Galera Transect 3",
    locationName: "Sabang Bay, Mindoro",
    status: "in-progress",
    syncStatus: "synced",
  },
  {
    id: "3",
    title: "Balingasay Coastal Site",
    locationName: "Balingasay, Pangasinan",
    status: "completed",
    syncStatus: "synced",
  },
];

const SurveyRow = memo(function SurveyRow({
  item,
  onPress,
}: {
  item: SurveyItemDisplay;
  onPress: (id: string) => void;
}) {
  const isCompleted = item.status === "completed";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={12} color={colors.textTertiary} />
          <Text style={styles.cardLocation} numberOfLines={1}>
            {item.locationName}
          </Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isCompleted ? colors.success : colors.info },
          ]}
        />
        <ChevronRight size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
});

export default function SurveysListScreen() {
  const insets = useSafeAreaInsets();
  const [surveys, setSurveys] = useState<SurveyItemDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSurveys = useCallback(async () => {
    try {
      const localData = await getLocalSurveys();
      if (localData.length > 0) {
        const formatted: SurveyItemDisplay[] = localData.map((s) => ({
          id: s.local_id,
          title: s.title,
          locationName: s.location_name || "Coastline",
          status: s.status,
          syncStatus: s.sync_status,
        }));
        setSurveys(formatted);
      } else {
        setSurveys(DEFAULT_SAMPLE_SURVEYS);
      }
    } catch {
      setSurveys(DEFAULT_SAMPLE_SURVEYS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSurveys();
    }, [loadSurveys])
  );

  const handleSurveyPress = useCallback((id: string) => {
    router.push(`/survey/${id}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SurveyItemDisplay }) => (
      <SurveyRow item={item} onPress={handleSurveyPress} />
    ),
    [handleSurveyPress]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 20) }]}
      >
        <Text style={styles.topBarTitle}>Surveys</Text>

        <Pressable
          style={styles.newBtn}
          onPress={() => router.push("/survey/new")}
        >
          <Plus size={16} color={colors.textOnPrimary} strokeWidth={2.5} />
          <Text style={styles.newBtnText}>New</Text>
        </Pressable>
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <SurveySkeletonRow />
            <SurveySkeletonRow />
            <SurveySkeletonRow />
          </View>
        ) : (
          <FlatList
            data={surveys}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Layers size={32} color={colors.textTertiary} />
                <Text style={styles.emptyTitle}>No surveys recorded</Text>
                <Text style={styles.emptyDesc}>
                  Tap "New" to log your first field transect.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <BottomNavBar activeTab="surveys" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  topBarTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  newBtnText: {
    color: colors.textOnPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  listContainer: {
    flex: 1,
  },
  loadingWrap: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },

  /* Card — simplified, no dense metric grid */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  cardPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardLocation: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  /* Empty state */
  emptyContainer: {
    padding: spacing.xxxxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
