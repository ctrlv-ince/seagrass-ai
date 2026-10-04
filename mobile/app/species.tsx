import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { router } from "expo-router";

interface SpeciesCardData {
  scientificName: string;
  commonName: string;
  bladeLength: string;
  shootDensity: string;
  dampingTier: string;
  features: string;
  fieldTip: string;
}

const SPECIES_LIST: SpeciesCardData[] = [
  {
    scientificName: "Enhalus acoroides",
    commonName: "Tropical Ribbon Grass",
    bladeLength: "30 – 150 cm",
    shootDensity: "100 – 350 /m²",
    dampingTier: "Very High (>60%)",
    features: "Long strap blades with air chambers; black bristle fibers on rhizome.",
    fieldTip: "Largest seagrass in Southeast Asia. Coarse ribbon blades stay buoyant in water.",
  },
  {
    scientificName: "Thalassia hemprichii",
    commonName: "Pacific Turtle Grass",
    bladeLength: "10 – 35 cm",
    shootDensity: "200 – 600 /m²",
    dampingTier: "High (45-60%)",
    features: "Sickle-shaped curved blades; black/red tannin speckles along blade.",
    fieldTip: "Reef-flat carpet builder. Look for curved leaves with longitudinal flecks against sunlight.",
  },
  {
    scientificName: "Cymodocea rotundata",
    commonName: "Ribbon Seagrass",
    bladeLength: "8 – 25 cm",
    shootDensity: "250 – 700 /m²",
    dampingTier: "Moderate (35-45%)",
    features: "Smooth rounded leaf tip; circular closed ring scars on short shoot stems.",
    fieldTip: "Blunt rounded leaf tips without serrations. Stems have clear circular rings.",
  },
  {
    scientificName: "Halodule pinifolia",
    commonName: "Fiber-strand Seagrass",
    bladeLength: "5 – 20 cm",
    shootDensity: "400 – 1200 /m²",
    dampingTier: "Moderate (30-40%)",
    features: "Narrow needle-like green blades; trident leaf tip with minute central tooth.",
    fieldTip: "Fine hair-like strands resembling pine needles in shallow intertidal sand.",
  },
  {
    scientificName: "Halophila ovalis",
    commonName: "Paddle Grass",
    bladeLength: "1 – 4 cm",
    shootDensity: "500 – 1500 /m²",
    dampingTier: "Low-Moderate (<30%)",
    features: "Paired oval paddle-shaped leaves on thin stalk; 10-25 paired cross-veins.",
    fieldTip: "Distinctive clover/paddle leaves. Completely distinct from ribbon seagrasses.",
  },
];

export default function SpeciesScreen() {
  const [search, setSearch] = useState("");

  const filtered = SPECIES_LIST.filter(
    (s) =>
      s.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      s.commonName.toLowerCase().includes(search.toLowerCase()) ||
      s.features.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Species Field Guide</Text>
        <Text style={styles.subtitle}>
          Visual identification keys and hydrodynamic wave damping ratings.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search species name, blade traits..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Species Cards */}
      <View style={styles.list}>
        {filtered.map((item) => (
          <View key={item.scientificName} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.names}>
                <Text style={styles.scientificName}>{item.scientificName}</Text>
                <Text style={styles.commonName}>{item.commonName}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.dampingTier.split(" ")[0]}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>BLADE LENGTH</Text>
                <Text style={styles.statVal}>{item.bladeLength}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>SHOOT DENSITY</Text>
                <Text style={styles.statVal}>{item.shootDensity}</Text>
              </View>
            </View>

            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>Key Features:</Text>
              <Text style={styles.featureText}>{item.features}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>Field ID: </Text>
                {item.fieldTip}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Button to scan quadrat */}
      <Pressable onPress={() => router.push("/capture")} style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Open Camera Scanner</Text>
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
    gap: 14,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  searchContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 13,
    color: "#0f172a",
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  names: {
    flex: 1,
  },
  scientificName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    fontStyle: "italic",
  },
  commonName: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  badge: {
    backgroundColor: "#f0fdfa",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#99f6e4",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94a3b8",
  },
  statVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 2,
  },
  featureBox: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
  },
  featureLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 2,
  },
  featureText: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 15,
  },
  tipBox: {
    backgroundColor: "#f0fdfa",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccfbf1",
  },
  tipText: {
    fontSize: 11,
    color: "#0f766e",
    lineHeight: 15,
  },
  tipBold: {
    fontWeight: "700",
  },
  actionBtn: {
    backgroundColor: "#0d9488",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  actionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
