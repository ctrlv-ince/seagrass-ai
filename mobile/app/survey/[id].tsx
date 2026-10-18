import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Camera,
  MapPin,
  User,
  Calendar,
  Waves,
  Leaf,
  Plus,
} from "lucide-react-native";
import { z } from "zod";
import {
  getLocalSurveyById,
  getLocalSurveyImages,
  LocalSurvey,
  LocalSurveyImage,
} from "@/db/repository";
import { CardSkeleton } from "@/components/Skeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

const ParamsSchema = z.object({
  id: z.string().min(1),
});

export default function SurveyDetailScreen() {
  const insets = useSafeAreaInsets();
  const rawParams = useLocalSearchParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<LocalSurvey | null>(null);
  const [images, setImages] = useState<LocalSurveyImage[]>([]);

  const loadData = useCallback(async () => {
    if (!parsed.success) return;
    try {
      setLoading(true);
      const surveyData = await getLocalSurveyById(parsed.data.id);
      if (surveyData) {
        setSurvey(surveyData);
        const imagesData = await getLocalSurveyImages(parsed.data.id);
        setImages(imagesData);
      } else {
        setSurvey(null);
        setImages([]);
      }
    } catch (err) {
      console.warn("Failed to load local survey details:", err);
    } finally {
      setLoading(false);
    }
  }, [parsed.success, parsed.data?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (!parsed.success) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Invalid survey identifier.</Text>
        <Pressable
          style={styles.backBtnFallback}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnFallbackText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const { id } = parsed.data;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
          <Pressable
            style={styles.topBarBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.topBarTitle}>Survey Details</Text>
          <View style={styles.topBarRightPlaceholder} />
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </ScrollView>
      </View>
    );
  }

  const isLocal = !!survey;
  const isPending = survey?.sync_status === "pending";
  const displayTitle = survey?.title || "Survey Session";
  const displayLocation =
    survey?.location_name ||
    (survey?.latitude && survey?.longitude
      ? `${survey.latitude.toFixed(3)}°N, ${survey.longitude.toFixed(3)}°E`
      : "Santiago Island, Pangasinan");
  const surveyor = survey?.surveyor_name || "Field Team";

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable
          style={styles.topBarBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {displayTitle}
        </Text>
        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.surveyIdText}>
              {isLocal
                ? `ID: #${id.slice(-6).toUpperCase()}`
                : `ID: #${id}`}
            </Text>
            <Badge
              label={
                isLocal
                  ? isPending
                    ? "Pending Sync"
                    : "Cloud Synced"
                  : "Completed"
              }
              variant={
                isLocal
                  ? isPending
                    ? "warning"
                    : "info"
                  : "success"
              }
              dot
            />
          </View>

          <Text style={styles.heading}>{displayTitle}</Text>

          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{displayLocation}</Text>
          </View>

          <View style={styles.metaRow}>
            <User size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Surveyor: {surveyor}</Text>
          </View>

          {survey?.created_at && (
            <View style={styles.metaRow}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {new Date(survey.created_at).toLocaleDateString()} at{" "}
                {new Date(survey.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        </Card>

        {/* Captured Quadrat Photos */}
        <Card style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleGroup}>
              <Camera size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>
                Quadrat Scans ({images.length})
              </Text>
            </View>
            <Pressable
              style={styles.addMiniBtn}
              onPress={() =>
                router.push({
                  pathname: "/capture",
                  params: { surveyId: id },
                })
              }
            >
              <Plus size={13} color={colors.primary} />
              <Text style={styles.addMiniBtnText}>Scan</Text>
            </Pressable>
          </View>

          {images.length === 0 ? (
            <View style={styles.emptyQuadratBox}>
              <Text style={styles.emptyQuadratText}>
                No quadrat photos captured yet for this session.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
              contentContainerStyle={styles.imageScrollContent}
            >
              {images.map((img) => (
                <View key={img.local_id} style={styles.imageCard}>
                  <Image
                    source={{ uri: img.file_uri }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.imageMeta}>
                    <Badge
                      label={img.sync_status === "synced" ? "Synced" : "Queued"}
                      variant={img.sync_status === "synced" ? "success" : "warning"}
                      size="sm"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </Card>

        {/* Meadow Specs Card */}
        <Card style={styles.card}>
          <View style={styles.sectionTitleGroup}>
            <Leaf size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Meadow Characteristics</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Identified Species</Text>
            <Text style={styles.specValueItalic}>Enhalus acoroides</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Canopy Coverage</Text>
            <Text style={styles.specValueBold}>76.5% Mean</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Average Blade Length</Text>
            <Text style={styles.specValueBold}>28.5 cm</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Shoot Density</Text>
            <Text style={styles.specValueBold}>420 shoots / m²</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Water Depth</Text>
            <Text style={styles.specValueBold}>1.80 meters</Text>
          </View>

          <View style={[styles.specItem, styles.specItemLast]}>
            <Text style={styles.specLabel}>Quadrats Sampled</Text>
            <Text style={styles.specValueBold}>
              {images.length > 0
                ? `${images.length} quadrats recorded`
                : "Transect baseline"}
            </Text>
          </View>
        </Card>

        {/* Wave Attenuation Impact Card */}
        <Card style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleGroup}>
              <Waves size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>Wave Attenuation</Text>
            </View>
            <Badge label="-58.4%" variant="primary" size="md" />
          </View>

          <Text style={styles.waveDescription}>
            The dense canopy attenuates incoming wave energy before reaching shoreline.
          </Text>

          <View style={styles.waveMetricsRow}>
            <View style={styles.waveMetricBox}>
              <Text style={styles.waveMetricLabel}>Incoming Wave</Text>
              <Text style={styles.waveMetricVal}>1.60 m</Text>
            </View>
            <View style={[styles.waveMetricBox, styles.waveMetricBoxHighlight]}>
              <Text style={styles.waveMetricLabelHighlight}>Dampened Wave</Text>
              <Text style={styles.waveMetricValHighlight}>0.67 m</Text>
            </View>
          </View>
        </Card>

        {/* Action Button: Add Quadrat Scan */}
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/capture",
              params: { surveyId: id },
            })
          }
        >
          <Camera size={18} color={colors.surface} />
          <Text style={styles.actionBtnText}>Add Quadrat Scan</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  topBarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSecondary,
  },
  topBarTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },
  topBarRightPlaceholder: {
    width: 44,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  surveyIdText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textTertiary,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  addMiniBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  addMiniBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
  },
  emptyQuadratBox: {
    paddingVertical: spacing.md,
  },
  emptyQuadratText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  imageScroll: {
    marginTop: spacing.xs,
  },
  imageScrollContent: {
    gap: spacing.sm,
  },
  imageCard: {
    width: 100,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSecondary,
  },
  thumbnail: {
    width: 100,
    height: 80,
    backgroundColor: colors.borderLight,
  },
  imageMeta: {
    padding: 4,
    alignItems: "center",
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  specItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  specLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  specValueBold: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  specValueItalic: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    fontStyle: "italic",
    color: colors.text,
  },
  waveDescription: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  waveMetricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  waveMetricBox: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
  },
  waveMetricBoxHighlight: {
    backgroundColor: colors.primarySubtle,
  },
  waveMetricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  waveMetricLabelHighlight: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
  },
  waveMetricVal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  waveMetricValHighlight: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtnPressed: {
    opacity: 0.9,
  },
  actionBtnText: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginBottom: spacing.md,
  },
  backBtnFallback: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  backBtnFallbackText: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
  },
});
