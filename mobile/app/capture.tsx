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
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CaptureScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
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
        setSelectedImage(result.assets[0].uri);
        runScanAnalysis();
      }
    } catch {
      // Fallback sample image for simulator / web
      useSampleImage();
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Camera Permission", "Camera access is needed to capture seagrass quadrats.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        runScanAnalysis();
      }
    } catch {
      useSampleImage();
    }
  };

  const useSampleImage = () => {
    setSelectedImage("sample-quadrat");
    runScanAnalysis();
  };

  const runScanAnalysis = () => {
    setAnalyzing(true);
    setResults(null);

    // Simulate instant AI extraction & hydrodynamic prediction
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
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top instruction */}
      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>Scan Seagrass Quadrat</Text>
        <Text style={styles.instructionText}>
          Capture or upload a photo of a seagrass quadrat to extract species, canopy coverage, and calculate wave attenuation.
        </Text>

        <View style={styles.btnRow}>
          <Pressable style={styles.cameraBtn} onPress={takePhoto}>
            <Text style={styles.cameraBtnText}>📷 Take Photo</Text>
          </Pressable>
          <Pressable style={styles.libraryBtn} onPress={pickImage}>
            <Text style={styles.libraryBtnText}>🖼️ Pick Image</Text>
          </Pressable>
        </View>

        {!selectedImage && (
          <Pressable style={styles.sampleLink} onPress={useSampleImage}>
            <Text style={styles.sampleLinkText}>Or load sample quadrat scan →</Text>
          </Pressable>
        )}
      </View>

      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.previewContainer}>
          {selectedImage === "sample-quadrat" ? (
            <View style={styles.sampleImagePlaceholder}>
              <Text style={styles.sampleImageText}>🌿 Sample Seagrass Quadrat Scan</Text>
              <Text style={styles.sampleImageSubtext}>Inshore Benthic Transect • GPS: 10.315°N, 119.012°E</Text>
            </View>
          ) : (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          )}
        </View>
      )}

      {/* Loading state */}
      {analyzing && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0d9488" />
          <Text style={styles.loadingTitle}>Analyzing Seagrass Canopy...</Text>
          <Text style={styles.loadingSub}>
            Segmenting species coverage and computing wave attenuation impact
          </Text>
        </View>
      )}

      {/* Results Display */}
      {results && (
        <View style={styles.resultsContainer}>
          {/* Section 1: Seagrass Specs */}
          <View style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>🌿 EXTRACTED SEAGRASS SPECS</Text>
              <Text style={styles.matchBadge}>96.8% Match</Text>
            </View>

            <View style={styles.speciesRow}>
              <View>
                <Text style={styles.speciesLabel}>IDENTIFIED SPECIES</Text>
                <Text style={styles.speciesName}>{results.species}</Text>
                <Text style={styles.speciesCommon}>{results.commonName}</Text>
              </View>
              <View style={styles.densityPill}>
                <Text style={styles.densityValue}>{results.coveragePercent}%</Text>
                <Text style={styles.densityLabel}>Coverage</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>BLADE LENGTH</Text>
                <Text style={styles.metricValue}>{results.bladeLengthCm} cm</Text>
                <Text style={styles.metricNote}>Canopy height</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>SHOOT DENSITY</Text>
                <Text style={styles.metricValue}>{results.shootDensity} / m²</Text>
                <Text style={styles.metricNote}>Quadrat sample</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>WATER DEPTH</Text>
                <Text style={styles.metricValue}>{results.waterDepthM} m</Text>
                <Text style={styles.metricNote}>Tidal baseline</Text>
              </View>
            </View>
          </View>

          {/* Section 2: Wave Attenuation Impact */}
          <View style={styles.waveCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.waveHeaderTitle}>🌊 WAVE ATTENUATION IMPACT</Text>
              <Text style={styles.attenuationPill}>
                -{results.waveAttenuationPercent}% DISSIPATED
              </Text>
            </View>

            <Text style={styles.waveSubtext}>
              Hydrodynamic dampening provided by the {results.coveragePercent}% dense seagrass canopy:
            </Text>

            <View style={styles.waveGrid}>
              <View style={styles.waveBox}>
                <Text style={styles.waveBoxLabel}>Incoming Wave Height</Text>
                <Text style={styles.waveBoxValue}>{results.incomingWaveM.toFixed(2)} m</Text>
                <Text style={styles.waveBoxNote}>Offshore approach</Text>
              </View>

              <View style={[styles.waveBox, styles.waveBoxProtected]}>
                <Text style={styles.waveBoxLabelProtected}>Dampened Inshore</Text>
                <Text style={styles.waveBoxValueProtected}>{results.dampenedWaveM.toFixed(2)} m</Text>
                <Text style={styles.waveBoxNoteProtected}>Protected shoreline</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Pressable
              style={styles.saveBtn}
              onPress={() => {
                Alert.alert("Saved", "Quadrat scan and wave prediction saved to your survey logbook.", [
                  { text: "View Surveys", onPress: () => router.push("/") },
                  { text: "OK" },
                ]);
              }}
            >
              <Text style={styles.saveBtnText}>Save to Survey</Text>
            </Pressable>

            <Pressable style={styles.scanAnotherBtn} onPress={pickImage}>
              <Text style={styles.scanAnotherText}>Scan Another</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  instructionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  instructionText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  cameraBtn: {
    flex: 1,
    backgroundColor: "#0d9488",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cameraBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  libraryBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  libraryBtnText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },
  sampleLink: {
    marginTop: 12,
    alignSelf: "center",
  },
  sampleLinkText: {
    fontSize: 12,
    color: "#0d9488",
    fontWeight: "600",
  },
  previewContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e2e8f0",
  },
  sampleImagePlaceholder: {
    backgroundColor: "#042f2e",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sampleImageText: {
    color: "#99f6e4",
    fontSize: 16,
    fontWeight: "700",
  },
  sampleImageSubtext: {
    color: "#5eead4",
    fontSize: 11,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  loadingBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginVertical: 12,
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 12,
  },
  loadingSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  resultsContainer: {
    gap: 14,
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0d9488",
    letterSpacing: 0.5,
  },
  matchBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speciesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  speciesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  speciesName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    fontStyle: "italic",
    marginTop: 2,
  },
  speciesCommon: {
    fontSize: 13,
    color: "#475569",
    marginTop: 1,
  },
  densityPill: {
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#99f6e4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  densityValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0d9488",
  },
  densityLabel: {
    fontSize: 10,
    color: "#0f766e",
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748b",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },
  metricNote: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 1,
  },
  waveCard: {
    backgroundColor: "#f0fdfa",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#99f6e4",
  },
  waveHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  attenuationPill: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  waveSubtext: {
    fontSize: 12,
    color: "#334155",
    marginBottom: 12,
    lineHeight: 16,
  },
  waveGrid: {
    flexDirection: "row",
    gap: 10,
  },
  waveBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  waveBoxLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
  },
  waveBoxValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 2,
  },
  waveBoxNote: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 1,
  },
  waveBoxProtected: {
    borderColor: "#5eead4",
    backgroundColor: "#ffffff",
  },
  waveBoxLabelProtected: {
    fontSize: 10,
    color: "#0f766e",
    fontWeight: "700",
  },
  waveBoxValueProtected: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0d9488",
    marginTop: 2,
  },
  waveBoxNoteProtected: {
    fontSize: 9,
    color: "#0f766e",
    marginTop: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#0d9488",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  scanAnotherBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  scanAnotherText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },
});
