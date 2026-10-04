import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { z } from "zod";

const ParamsSchema = z.object({
  id: z.string().min(1),
});

export default function SurveyDetailScreen() {
  const rawParams = useLocalSearchParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  if (!parsed.success) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid survey identifier.</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const { id } = parsed.data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.surveyTag}>SURVEY SESSION #{id}</Text>
          <Text style={styles.statusBadge}>Completed</Text>
        </View>

        <Text style={styles.heading}>Bolinao Inshore Meadow</Text>
        <Text style={styles.locationText}>📍 Santiago Island, Pangasinan • 16.384°N, 119.892°E</Text>
      </View>

      {/* Extracted Seagrass Specs Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌿 MEADOW SPECS</Text>
        
        <View style={styles.speciesRow}>
          <Text style={styles.specLabel}>Identified Species:</Text>
          <Text style={styles.specValueItalic}>Enhalus acoroides</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Canopy Coverage:</Text>
          <Text style={styles.specValueBold}>76.5% Mean</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Average Blade Length:</Text>
          <Text style={styles.specValueBold}>28.5 cm</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Shoot Density:</Text>
          <Text style={styles.specValueBold}>420 shoots / m²</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Water Depth:</Text>
          <Text style={styles.specValueBold}>1.80 meters</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Quadrats Sampled:</Text>
          <Text style={styles.specValueBold}>10 points along 50m transect</Text>
        </View>
      </View>

      {/* Wave Attenuation Impact Card */}
      <View style={[styles.card, styles.waveCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.waveSectionTitle}>🌊 WAVE ATTENUATION IMPACT</Text>
          <Text style={styles.waveAttenuationBadge}>-58.4%</Text>
        </View>

        <Text style={styles.waveDescription}>
          The 76.5% dense seagrass canopy attenuates incoming wave energy before reaching the shoreline.
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
      </View>

      {/* Action Button */}
      <Pressable
        style={styles.actionBtn}
        onPress={() => router.push("/capture")}
      >
        <Text style={styles.actionBtnText}>📷 Add Quadrat Scan</Text>
      </Pressable>
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
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  surveyTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0d9488",
    letterSpacing: 0.5,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heading: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0d9488",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  speciesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  specLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  specValueBold: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  specValueItalic: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0d9488",
    fontStyle: "italic",
  },
  waveCard: {
    backgroundColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
  waveSectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  waveAttenuationBadge: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  waveDescription: {
    fontSize: 12,
    color: "#334155",
    marginTop: 4,
    lineHeight: 16,
  },
  waveMetricsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  waveMetricBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  waveMetricLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  waveMetricVal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },
  waveMetricBoxHighlight: {
    borderColor: "#5eead4",
  },
  waveMetricLabelHighlight: {
    fontSize: 10,
    color: "#0f766e",
    fontWeight: "600",
  },
  waveMetricValHighlight: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0d9488",
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: "#0d9488",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  actionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  backBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
  backBtnText: {
    color: "#0d9488",
    fontSize: 14,
    fontWeight: "600",
  },
});
