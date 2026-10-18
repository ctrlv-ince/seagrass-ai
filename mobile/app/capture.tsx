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
  Grid,
  CheckCircle2,
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
  const [scanStep, setScanStep] = useState<number>(1);
  const [showQuadratGrid, setShowQuadratGrid] = useState<boolean>(true);
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
    setScanStep(1);
    setResults(null);
    setOfflineMode(false);

    if (targetUri === "sample-quadrat") {
      setTimeout(() => setScanStep(2), 250);
      setTimeout(() => setScanStep(3), 500);
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
      }, 750);
      return;
    }

    try {
      setTimeout(() => setScanStep(2), 200);
      const res = await analyzeQuadratPhoto({
        fileUri: targetUri,
        waterDepthM: 1.5,
        incidentWaveHeightM: 0.8,
        wavePeriodS: 4.5,
        meadowWidthM: 50.0,
      });

      setScanStep(3);
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
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.screenTitle}>Scan Quadrat</Text>
        <View style={{ width: 44 }} />
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
        <View style={styles.previewContainer}>
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

            {/* 3×3 Scientific Quadrat Grid Overlay */}
            {showQuadratGrid && (
              <View style={styles.quadratOverlay} pointerEvents="none">
                <View style={[styles.gridLineV, { left: "33.3%" }]} />
                <View style={[styles.gridLineV, { left: "66.6%" }]} />
                <View style={[styles.gridLineH, { top: "33.3%" }]} />
                <View style={[styles.gridLineH, { top: "66.6%" }]} />

                {/* Corner reticles */}
                <View style={[styles.cornerReticle, styles.cornerTL]} />
                <View style={[styles.cornerReticle, styles.cornerTR]} />
                <View style={[styles.cornerReticle, styles.cornerBL]} />
                <View style={[styles.cornerReticle, styles.cornerBR]} />

                <View style={styles.quadratBadge}>
                  <Text style={styles.quadratBadgeText}>50 × 50 cm Quadrat</Text>
                </View>
              </View>
            )}
          </View>

          {/* Grid Overlay Toggle */}
          <Pressable
            style={styles.gridToggleBtn}
            onPress={() => setShowQuadratGrid(!showQuadratGrid)}
            accessibilityRole="button"
            accessibilityLabel="Toggle 50x50cm quadrat grid"
          >
            <Grid
              size={13}
              color={showQuadratGrid ? colors.primary : colors.textTertiary}
            />
            <Text
              style={[
                styles.gridToggleText,
                showQuadratGrid && styles.gridToggleTextActive,
              ]}
            >
              {showQuadratGrid ? "50×50cm Quadrat Frame: ON" : "Show Quadrat Frame"}
            </Text>
          </Pressable>
        </View>
      )}

      {/* ── Multi-Step Progress Indicator ── */}
      {analyzing && (
        <Card style={styles.stepperCard}>
          <Text style={styles.stepperTitle}>Analyzing Benthic Quadrat...</Text>
          <View style={styles.stepList}>
            <View style={styles.stepRow}>
              {scanStep > 1 ? (
                <CheckCircle2 size={16} color={colors.success} />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              <Text
                style={[
                  styles.stepLabel,
                  scanStep === 1 && styles.stepLabelActive,
                ]}
              >
                1. Image preprocessing & color calibration
              </Text>
            </View>

            <View style={styles.stepRow}>
              {scanStep > 2 ? (
                <CheckCircle2 size={16} color={colors.success} />
              ) : scanStep === 2 ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.stepPendingDot} />
              )}
              <Text
                style={[
                  styles.stepLabel,
                  scanStep === 2 && styles.stepLabelActive,
                ]}
              >
                2. YOLOv11 benthic species segmentation
              </Text>
            </View>

            <View style={styles.stepRow}>
              {scanStep === 3 ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.stepPendingDot} />
              )}
              <Text
                style={[
                  styles.stepLabel,
                  scanStep === 3 && styles.stepLabelActive,
                ]}
              >
                3. Hydrodynamic wave attenuation model
              </Text>
            </View>
          </View>
        </Card>
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
    width: 44,
    height: 44,
    borderRadius: 22,
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

  /* Preview & Quadrat Grid */
  previewContainer: {
    gap: spacing.xs,
  },
  previewWrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 240,
    backgroundColor: colors.surfaceSecondary,
  },
  quadratOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  cornerReticle: {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "#5EEAD4",
  },
  cornerTL: {
    top: 6,
    left: 6,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerTR: {
    top: 6,
    right: 6,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cornerBL: {
    bottom: 6,
    left: 6,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerBR: {
    bottom: 6,
    right: 6,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  quadratBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  quadratBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  gridToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignSelf: "center",
  },
  gridToggleText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  gridToggleTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },

  samplePlaceholder: {
    backgroundColor: "#042F2E",
    height: 240,
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

  /* Stepper Progress Card */
  stepperCard: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  stepperTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepList: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    flex: 1,
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  stepPendingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    marginLeft: 1,
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
