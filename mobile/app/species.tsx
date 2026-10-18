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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Camera,
  Info,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

interface SpeciesCardData {
  scientificName: string;
  commonName: string;
  bladeLength: string;
  shootDensity: string;
  dampingTier: string;
  tierVariant: BadgeVariant;
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
    tierVariant: "success",
    features:
      "Long strap blades with air chambers; black bristle fibers on rhizome.",
    fieldTip:
      "Largest seagrass in Southeast Asia. Coarse ribbon blades stay buoyant in water.",
  },
  {
    scientificName: "Thalassia hemprichii",
    commonName: "Pacific Turtle Grass",
    bladeLength: "10 – 35 cm",
    shootDensity: "200 – 600 /m²",
    dampingTier: "High (45–60%)",
    tierVariant: "primary",
    features:
      "Sickle-shaped curved blades; black/red tannin speckles along blade.",
    fieldTip:
      "Reef-flat carpet builder. Look for curved leaves with longitudinal flecks against sunlight.",
  },
  {
    scientificName: "Cymodocea rotundata",
    commonName: "Ribbon Seagrass",
    bladeLength: "8 – 25 cm",
    shootDensity: "250 – 700 /m²",
    dampingTier: "Moderate (35–45%)",
    tierVariant: "info",
    features:
      "Smooth rounded leaf tip; circular closed ring scars on short shoot stems.",
    fieldTip:
      "Blunt rounded leaf tips without serrations. Stems have clear circular rings.",
  },
  {
    scientificName: "Halodule pinifolia",
    commonName: "Fiber-strand Seagrass",
    bladeLength: "5 – 20 cm",
    shootDensity: "400 – 1200 /m²",
    dampingTier: "Moderate (30–40%)",
    tierVariant: "info",
    features:
      "Narrow needle-like green blades; trident leaf tip with minute central tooth.",
    fieldTip:
      "Fine hair-like strands resembling pine needles in shallow intertidal sand.",
  },
  {
    scientificName: "Halophila ovalis",
    commonName: "Paddle Grass",
    bladeLength: "1 – 4 cm",
    shootDensity: "500 – 1500 /m²",
    dampingTier: "Low-Moderate (<30%)",
    tierVariant: "warning",
    features:
      "Paired oval paddle-shaped leaves on thin stalk; 10–25 paired cross-veins.",
    fieldTip:
      "Distinctive clover/paddle leaves. Completely distinct from ribbon seagrasses.",
  },
];

export default function SpeciesScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);

  const toggleExpand = (scientificName: string) => {
    setExpandedSpecies((current) =>
      current === scientificName ? null : scientificName
    );
  };

  const filtered = SPECIES_LIST.filter(
    (s) =>
      s.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      s.commonName.toLowerCase().includes(search.toLowerCase()) ||
      s.features.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.push("/more"))}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Species Guide</Text>
        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle description */}
        <View style={styles.headerTextWrap}>
          <Text style={styles.subtitle}>
            Field identification keys and hydrodynamic wave damping ratings.
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            placeholder="Search species name or traits..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
        </View>

        {/* Species List */}
        <View style={styles.list}>
          {filtered.map((item) => {
            const isExpanded = expandedSpecies === item.scientificName;
            return (
              <Card key={item.scientificName} style={styles.card}>
                <Pressable
                  onPress={() => toggleExpand(item.scientificName)}
                  style={styles.cardHeader}
                >
                  <View style={styles.names}>
                    <Text style={styles.scientificName}>
                      {item.scientificName}
                    </Text>
                    <Text style={styles.commonName}>{item.commonName}</Text>
                  </View>

                  <View style={styles.headerRight}>
                    <Badge
                      label={item.dampingTier.split(" ")[0]}
                      variant={item.tierVariant}
                      size="sm"
                    />
                    <View style={styles.chevronWrap}>
                      {isExpanded ? (
                        <ChevronUp size={18} color={colors.textTertiary} />
                      ) : (
                        <ChevronDown size={18} color={colors.textTertiary} />
                      )}
                    </View>
                  </View>
                </Pressable>

                {/* Collapsible Details */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.statsRow}>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Blade Length</Text>
                        <Text style={styles.statVal}>{item.bladeLength}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Shoot Density</Text>
                        <Text style={styles.statVal}>{item.shootDensity}</Text>
                      </View>
                    </View>

                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Key Characteristics</Text>
                      <Text style={styles.bodyText}>{item.features}</Text>
                    </View>

                    <View style={styles.tipBox}>
                      <Info size={15} color={colors.primary} style={styles.tipIcon} />
                      <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Field ID Tip</Text>
                        <Text style={styles.tipText}>{item.fieldTip}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Action Button */}
        <Pressable
          onPress={() => router.push("/capture")}
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
        >
          <Camera size={18} color={colors.surface} />
          <Text style={styles.actionBtnText}>Scan with Camera</Text>
        </Pressable>
      </ScrollView>

      <BottomNavBar activeTab="more" />
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
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
  headerTextWrap: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    padding: 0,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  names: {
    flex: 1,
    marginRight: spacing.sm,
  },
  scientificName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    fontStyle: "italic",
  },
  commonName: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  chevronWrap: {
    marginLeft: 2,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  statVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  infoSection: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  bodyText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: colors.primarySubtle,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    gap: spacing.sm,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
    marginBottom: 2,
  },
  tipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionBtnPressed: {
    opacity: 0.9,
  },
  actionBtnText: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
});
