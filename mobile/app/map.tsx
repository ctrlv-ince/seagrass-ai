import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { router } from "expo-router";

// Mock spatial transects with seagrass specs and wave dampening
const SAMPLE_TRANSECTS = [
  {
    id: "T1",
    name: "Bolinao Inshore Meadow",
    species: "Enhalus acoroides",
    coverage: "78.4%",
    depth: "1.8 m",
    waveDampening: "-61.2%",
    lat: 16.384,
    lng: 119.892,
  },
  {
    id: "T2",
    name: "Santiago Reef Flat",
    species: "Thalassia hemprichii",
    coverage: "68.2%",
    depth: "1.2 m",
    waveDampening: "-52.8%",
    lat: 16.412,
    lng: 119.921,
  },
  {
    id: "T3",
    name: "Balingasay Coastal Fringe",
    species: "Halodule pinifolia",
    coverage: "82.0%",
    depth: "2.1 m",
    waveDampening: "-64.5%",
    lat: 16.356,
    lng: 119.854,
  },
];

export default function MapScreen() {
  const [selected, setSelected] = useState(SAMPLE_TRANSECTS[0]);

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>Surveyed Seagrass Meadows</Text>
          <Text style={styles.topBarSub}>Benthic GPS Transects & Wave Attenuation Sites</Text>
        </View>
        <Pressable style={styles.scanBtn} onPress={() => router.push("/capture")}>
          <Text style={styles.scanBtnText}>+ Scan</Text>
        </Pressable>
      </View>

      {/* Simulated Map Visualizer */}
      <View style={styles.mapVisualizer}>
        <View style={styles.gridOverlay} />
        
        {/* Coastal shoreline graphic representation */}
        <View style={styles.landArea}>
          <Text style={styles.landText}>COASTLINE</Text>
        </View>

        {/* Transect markers */}
        {SAMPLE_TRANSECTS.map((t) => {
          const isSelected = selected.id === t.id;
          return (
            <Pressable
              key={t.id}
              style={[
                styles.marker,
                isSelected ? styles.markerSelected : styles.markerDefault,
              ]}
              onPress={() => setSelected(t)}
            >
              <Text style={styles.markerIcon}>🌿</Text>
              <Text
                style={[
                  styles.markerLabel,
                  isSelected ? styles.markerLabelSelected : undefined,
                ]}
              >
                {t.id}: {t.coverage}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Selected Transect Bottom Sheet */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <View>
            <Text style={styles.detailsSub}>TRANSECT {selected.id}</Text>
            <Text style={styles.detailsTitle}>{selected.name}</Text>
          </View>
          <View style={styles.waveBadge}>
            <Text style={styles.waveBadgeText}>{selected.waveDampening}</Text>
            <Text style={styles.waveBadgeSub}>Wave Dampening</Text>
          </View>
        </View>

        <View style={styles.specGrid}>
          <View style={styles.specBox}>
            <Text style={styles.specBoxLabel}>SPECIES</Text>
            <Text style={styles.specBoxValue}>{selected.species}</Text>
          </View>
          <View style={styles.specBox}>
            <Text style={styles.specBoxLabel}>COVERAGE</Text>
            <Text style={styles.specBoxValue}>{selected.coverage}</Text>
          </View>
          <View style={styles.specBox}>
            <Text style={styles.specBoxLabel}>WATER DEPTH</Text>
            <Text style={styles.specBoxValue}>{selected.depth}</Text>
          </View>
        </View>

        <View style={styles.coordsRow}>
          <Text style={styles.coordsText}>
            GPS: {selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E
          </Text>
          <Pressable
            onPress={() => router.push("/capture")}
            style={styles.addQuadratBtn}
          >
            <Text style={styles.addQuadratText}>Add Quadrat Scan →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  topBarSub: {
    fontSize: 11,
    color: "#64748b",
  },
  scanBtn: {
    backgroundColor: "#0d9488",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scanBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  mapVisualizer: {
    flex: 1,
    backgroundColor: "#e0f2fe",
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 40,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: "#0284c7",
  },
  landArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "25%",
    backgroundColor: "#fef3c7",
    borderRightWidth: 2,
    borderRightColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  landText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#b45309",
    transform: [{ rotate: "-90deg" }],
    letterSpacing: 2,
  },
  marker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#0d9488",
  },
  markerSelected: {
    backgroundColor: "#0d9488",
    borderColor: "#042f2e",
  },
  markerIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  markerLabelSelected: {
    color: "#ffffff",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsSub: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0d9488",
    letterSpacing: 0.5,
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },
  waveBadge: {
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#99f6e4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "flex-end",
  },
  waveBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0d9488",
  },
  waveBadgeSub: {
    fontSize: 9,
    color: "#0f766e",
  },
  specGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  specBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  specBoxLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748b",
  },
  specBoxValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
    marginTop: 2,
  },
  coordsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  coordsText: {
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#64748b",
  },
  addQuadratBtn: {
    paddingVertical: 4,
  },
  addQuadratText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0d9488",
  },
});
