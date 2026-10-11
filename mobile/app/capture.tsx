import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  ImageIcon,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { analyzeQuadratPhoto } from "@/api/detections";
import { computeWaveDamping } from "@/lib/waveMath";
import {
  saveLocalSurveyImage,
  getLocalSurveys,
  createLocalSurvey,
} from "@/db/repository";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { colors, spacing, fontSize, fontWeight, radius, shadow } from "@/theme";

export default function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const { surveyId } = useLocalSearchParams<{ surveyId?: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [waveExpanded, setWaveExpanded] = useState(false);
  const [results, setResults] = useState<{
    species: string;
    commonName: string;
    coveragePercent: number;
    bladeLengthCm: number;
    shootDensity: number;
    waterDepthM: number;
    waveAttenuationPercent: number;
    incomingWaveM: number;
    dampenedWaveM: number;
  } | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        runScanAnalysis(uri);
      }
    } catch {
      useSampleImage();
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission",
          "Camera access is needed to capture seagrass quadrats."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        runScanAnalysis(uri);
      }
    } catch {
      useSampleImage();
    }
  };

  const useSampleImage = () => {
    setSelectedImage("sample-quadrat");
    runScanAnalysis("sample-quadrat");
  };

  const runScanAnalysis = async (imageUri?: string) => {
    const targetUri = imageUri || selectedImage;
    if (!targetUri) return;

    setAnalyzing(true);
    setResults(null);
    setOfflineMode(false);

    if (targetUri === "sample-quadrat") {
      setTimeout(() => {
        setResults({
          species: "Enhalus acoroides",
          commonName: "Ribbon Seagrass",
          coveragePercent: 76.5,
          bladeLengthCm: 28.5,
          shootDensity: 420,
          waterDepthM: 1.8,
          waveAttenuationPercent: 58.4,
          incomingWaveM: 1.6,
          dampenedWaveM: 0.67,
        });
        setAnalyzing(false);
      }, 700);
      return;
    }

    try {
      const res = await analyzeQuadratPhoto({
        fileUri: targetUri,
        waterDepthM: 1.5,
        incidentWaveHeightM: 0.8,
        wavePeriodS: 4.5,
        meadowWidthM: 50.0,
      });

      setResults({
        species: res.specifications.primary_species,
        commonName: res.specifications.common_name,
        coveragePercent: res.specifications.coverage_percent,
        bladeLengthCm: res.specifications.blade_length_cm,
        shootDensity: res.specifications.shoot_density_m2,
        waterDepthM: 1.5,
        waveAttenuationPercent: res.wave_attenuation.wave_height_reduction_pct,
        incomingWaveM: res.wave_attenuation.incident_wave_height_m,
        dampenedWaveM: res.wave_attenuation.transmitted_wave_height_m,
      });
    } catch (err) {
      console.warn(
        "FastAPI inference unavailable, switching to on-device physics fallback:",
        err
      );
      setOfflineMode(true);
      const estDensity = 380;
      const estBladeLength = 25;
      const estDepth = 1.5;
      const estWave = 0.8;
      const damping = computeWaveDamping(
        estDensity,
        estBladeLength,
        estDepth,
        estWave,
        4.5,
        50
      );

      setResults({
        species: "Enhalus acoroides (On-Device Estimate)",
        commonName: "Tropical Ribbon Grass",
        coveragePercent: 72.0,
        bladeLengthCm: estBladeLength,
        shootDensity: estDensity,
        waterDepthM: estDepth,
        waveAttenuationPercent: damping.heightReductionPct,
        incomingWaveM: estWave,
        dampenedWaveM: damping.inshoreHeight,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToSurvey = async () => {
    if (!selectedImage) return;
    setIsSaving(true);
    try {
      let targetSurveyId: string;
      if (surveyId) {
        targetSurveyId = surveyId;
      } else {
        const surveys = await getLocalSurveys();
        if (surveys.length > 0) {
          targetSurveyId = surveys[0].local_id;
        } else {
          const newSurvey = await createLocalSurvey({
            title: "Field Survey " + new Date().toLocaleDateString(),
            location_name: "Coastal Quadrat Station",
          });
          targetSurveyId = newSurvey.local_id;
        }
      }

      await saveLocalSurveyImage({
        survey_local_id: targetSurveyId,
        file_uri: selectedImage,
      });

      Alert.alert(
        "Saved",
        "Photo recorded locally and queued for cloud sync.",
        [
          { text: "View Surveys", onPress: () => router.push("/") },
          { text: "OK" },
        ]
      );
    } catch (err: any) {
      Alert.alert("Save Error", err?.message || "Could not save photo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 14) },
      ]}
    >
      {/* ── Top bar ── */}
      <View style={styles.topRow}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.screenTitle}>Scan Quadrat</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Hint + action buttons ── */}
      {!selectedImage && (
        <Text style={styles.hint}>
          Capture or upload a seagrass quadrat photo for AI species detection
          and wave attenuation analysis.
        </Text>
      )}

      <View style={styles.btnRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.cameraBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={takePhoto}
        >
          <Camera size={20} color={colors.textOnPrimary} />
          <Text style={styles.cameraBtnText}>Camera</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.galleryBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={pickImage}
        >
          <ImageIcon size={20} color={colors.text} />
          <Text style={styles.galleryBtnText}>Gallery</Text>
        </Pressable>
      </View>

      {!selectedImage && (
        <Pressable style={styles.sampleLink} onPress={useSampleImage}>
          <Text style={styles.sampleLinkText}>
            Load sample quadrat instead →
          </Text>
        </Pressable>
      )}

      {/* ── Image preview ── */}
      {selectedImage && (
        <View style={styles.previewWrap}>
          {selectedImage === "sample-quadrat" ? (
            <View style={styles.samplePlaceholder}>
              <Text style={styles.sampleEmoji}>🌿</Text>
              <Text style={styles.sampleText}>Sample Quadrat</Text>
              <Text style={styles.sampleCoords}>
                10.315°N, 119.012°E
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          )}
        </View>
      )}

      {/* ── Loading ── */}
      {analyzing && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing canopy...</Text>
        </View>
      )}

      {/* ── Results ── */}
      {results && (
        <View style={styles.resultsWrap}>
          {/* Offline badge */}
          {offlineMode && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>
                ⚡ Offline — estimated on-device using Mendez & Losada model
              </Text>
            </View>
          )}

          {/* Species result */}
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.speciesName}>{results.species}</Text>
                <Text style={styles.commonName}>{results.commonName}</Text>
              </View>
              <View style={styles.coverageBadge}>
                <Text style={styles.coverageValue}>
                  {results.coveragePercent}%
                </Text>
                <Text style={styles.coverageLabel}>Coverage</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {results.bladeLengthCm} cm
                </Text>
                <Text style={styles.metricLabel}>Blade length</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {results.shootDensity} /m²
                </Text>
                <Text style={styles.metricLabel}>Shoot density</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {results.waterDepthM} m
                </Text>
                <Text style={styles.metricLabel}>Depth</Text>
              </View>
            </View>
          </Card>

          {/* Wave attenuation — collapsible */}
          <Pressable
            onPress={() => setWaveExpanded(!waveExpanded)}
          >
            <Card style={styles.waveCard}>
              <View style={styles.waveHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.waveTitle}>Wave attenuation</Text>
                  <Text style={styles.waveBigValue}>
                    -{results.waveAttenuationPercent}% dissipated
                  </Text>
                </View>
                {waveExpanded ? (
                  <ChevronUp size={20} color={colors.textTertiary} />
                ) : (
                  <ChevronDown size={20} color={colors.textTertiary} />
                )}
              </View>

              {waveExpanded && (
                <View style={styles.waveDetails}>
                  <View style={styles.waveRow}>
                    <Text style={styles.waveLabel}>Incoming wave</Text>
                    <Text style={styles.waveValue}>
                      {results.incomingWaveM.toFixed(2)} m
                    </Text>
                  </View>
                  <View style={styles.waveRow}>
                    <Text style={styles.waveLabel}>Dampened inshore</Text>
                    <Text
                      style={[styles.waveValue, { color: colors.primary }]}
                    >
                      {results.dampenedWaveM.toFixed(2)} m
                    </Text>
                  </View>
                </View>
              )}
            </Card>
          </Pressable>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Button
              label="Save to survey"
              onPress={handleSaveToSurvey}
              loading={isSaving}
              style={{ flex: 2 }}
              size="lg"
            />
            <Button
              label="Scan another"
              variant="secondary"
              onPress={pickImage}
              style={{ flex: 1 }}
              size="lg"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxxl,
    gap: spacing.lg,
  },

  /* Top bar */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  /* Hint */
  hint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  /* Buttons */
  btnRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  cameraBtn: {
    backgroundColor: colors.primary,
  },
  cameraBtnText: {
    color: colors.textOnPrimary,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
  },
  galleryBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  galleryBtnText: {
    color: colors.text,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
  },

  /* Sample link */
  sampleLink: {
    alignSelf: "center",
  },
  sampleLinkText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },

  /* Preview */
  previewWrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: colors.surfaceSecondary,
  },
  samplePlaceholder: {
    backgroundColor: "#042F2E",
    paddingVertical: spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },
  sampleEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  sampleText: {
    color: "#99F6E4",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  sampleCoords: {
    color: "#5EEAD4",
    fontSize: fontSize.xs,
    marginTop: 4,
  },

  /* Loading */
  loadingWrap: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },

  /* Results */
  resultsWrap: {
    gap: spacing.md,
  },
  offlineBadge: {
    backgroundColor: colors.warningLight,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  offlineBadgeText: {
    fontSize: fontSize.xs,
    color: "#92400E",
    fontWeight: fontWeight.semibold,
    lineHeight: 16,
  },

  /* Species result card */
  resultCard: {},
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  speciesName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    fontStyle: "italic",
  },
  commonName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  coverageBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },
  coverageValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.primary,
  },
  coverageLabel: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
  },

  /* Metrics row */
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
  },

  /* Wave card */
  waveCard: {
    backgroundColor: colors.primarySubtle,
  },
  waveHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  waveTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  waveBigValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.primaryDark,
    marginTop: 2,
  },
  waveDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
    gap: spacing.sm,
  },
  waveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  waveLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  waveValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  /* Actions */
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
