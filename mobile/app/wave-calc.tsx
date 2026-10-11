import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Waves,
  Plus,
  Minus,
  Camera,
  Activity,
  Sliders,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";
import { computeWaveDamping } from "@/lib/waveMath";

const PRESETS = [
  {
    name: "Enhalus Ribbon",
    density: 240,
    bladeLength: 45,
    depth: 1.6,
    height: 0.9,
    width: 50,
  },
  {
    name: "Thalassia Reef",
    density: 380,
    bladeLength: 22,
    depth: 1.2,
    height: 0.75,
    width: 40,
  },
  {
    name: "Halodule Bed",
    density: 650,
    bladeLength: 12,
    depth: 0.9,
    height: 0.6,
    width: 35,
  },
];

export default function WaveCalcScreen() {
  const insets = useSafeAreaInsets();
  const [density, setDensity] = useState(340);
  const [bladeLength, setBladeLength] = useState(30);
  const [depth, setDepth] = useState(1.5);
  const [waveHeight, setWaveHeight] = useState(0.8);
  const [meadowWidth, setMeadowWidth] = useState(50);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const results = useMemo(() => {
    return computeWaveDamping(
      density,
      bladeLength,
      depth,
      waveHeight,
      4.5,
      meadowWidth
    );
  }, [density, bladeLength, depth, waveHeight, meadowWidth]);

  const applyPreset = (p: (typeof PRESETS)[0]) => {
    setSelectedPreset(p.name);
    setDensity(p.density);
    setBladeLength(p.bladeLength);
    setDepth(p.depth);
    setWaveHeight(p.height);
    setMeadowWidth(p.width);
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.push("/more"))}
          style={styles.backBtn}
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Wave Calculator</Text>
        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Model info banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconWrap}>
            <Waves size={20} color={colors.primary} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Wave Attenuation Model</Text>
            <Text style={styles.bannerDesc}>
              Mendez & Losada (2004) hydrodynamic physics model for coastal damping.
            </Text>
          </View>
        </View>

        {/* Primary Results Display */}
        <Card style={styles.heroResultCard}>
          <Text style={styles.heroResultLabel}>Energy Dissipation</Text>
          <Text style={styles.heroResultValue}>-{results.energyDampingPct}%</Text>
          <Text style={styles.heroResultCaption}>
            Total kinetic wave energy absorbed by canopy
          </Text>

          <View style={styles.secondaryResultsGrid}>
            <View style={styles.secondaryResultItem}>
              <Text style={styles.secondaryResultLabel}>Height Reduction</Text>
              <Text style={styles.secondaryResultValue}>
                -{results.heightReductionPct}%
              </Text>
              <Text style={styles.secondaryResultSub}>Wave crest decay</Text>
            </View>

            <View style={styles.secondaryDivider} />

            <View style={styles.secondaryResultItem}>
              <Text style={styles.secondaryResultLabel}>Inshore Wave</Text>
              <Text style={styles.secondaryResultValue}>
                {results.inshoreHeight} m
              </Text>
              <Text style={styles.secondaryResultSub}>
                From {waveHeight}m incident
              </Text>
            </View>
          </View>
        </Card>

        {/* Presets Row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Canopy Presets</Text>
        </View>
        <View style={styles.presetRow}>
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.name;
            return (
              <Pressable
                key={p.name}
                onPress={() => applyPreset(p)}
                style={[
                  styles.presetChip,
                  isSelected && styles.presetChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isSelected && styles.presetChipTextSelected,
                  ]}
                >
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Adjustable Parameter Steppers */}
        <Card style={styles.paramsCard}>
          <View style={styles.cardHeaderRow}>
            <Sliders size={16} color={colors.textSecondary} />
            <Text style={styles.cardHeaderTitle}>Field Parameters</Text>
          </View>

          {/* Shoot Density */}
          <View style={styles.paramRow}>
            <View style={styles.paramInfo}>
              <Text style={styles.paramName}>Shoot Density</Text>
              <Text style={styles.paramHint}>shoots / m²</Text>
            </View>
            <View style={styles.stepperContainer}>
              <Pressable
                onPress={() => {
                  setDensity((d) => Math.max(50, d - 50));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Minus size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.stepValue}>{density}</Text>
              <Pressable
                onPress={() => {
                  setDensity((d) => Math.min(1200, d + 50));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* Blade Length */}
          <View style={styles.paramRow}>
            <View style={styles.paramInfo}>
              <Text style={styles.paramName}>Blade Length</Text>
              <Text style={styles.paramHint}>canopy height (cm)</Text>
            </View>
            <View style={styles.stepperContainer}>
              <Pressable
                onPress={() => {
                  setBladeLength((l) => Math.max(5, l - 5));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Minus size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.stepValue}>{bladeLength} cm</Text>
              <Pressable
                onPress={() => {
                  setBladeLength((l) => Math.min(100, l + 5));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* Water Depth */}
          <View style={styles.paramRow}>
            <View style={styles.paramInfo}>
              <Text style={styles.paramName}>Water Depth</Text>
              <Text style={styles.paramHint}>water column (m)</Text>
            </View>
            <View style={styles.stepperContainer}>
              <Pressable
                onPress={() => {
                  setDepth((d) => Math.max(0.4, parseFloat((d - 0.2).toFixed(1))));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Minus size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.stepValue}>{depth.toFixed(1)} m</Text>
              <Pressable
                onPress={() => {
                  setDepth((d) => Math.min(8.0, parseFloat((d + 0.2).toFixed(1))));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* Offshore Wave Height */}
          <View style={styles.paramRow}>
            <View style={styles.paramInfo}>
              <Text style={styles.paramName}>Offshore Wave (H₀)</Text>
              <Text style={styles.paramHint}>incident height (m)</Text>
            </View>
            <View style={styles.stepperContainer}>
              <Pressable
                onPress={() => {
                  setWaveHeight((h) =>
                    Math.max(0.2, parseFloat((h - 0.1).toFixed(2)))
                  );
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Minus size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.stepValue}>{waveHeight.toFixed(2)} m</Text>
              <Pressable
                onPress={() => {
                  setWaveHeight((h) =>
                    Math.min(3.0, parseFloat((h + 0.1).toFixed(2)))
                  );
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* Meadow Width */}
          <View style={[styles.paramRow, styles.paramRowLast]}>
            <View style={styles.paramInfo}>
              <Text style={styles.paramName}>Meadow Width</Text>
              <Text style={styles.paramHint}>cross-shore width (m)</Text>
            </View>
            <View style={styles.stepperContainer}>
              <Pressable
                onPress={() => {
                  setMeadowWidth((w) => Math.max(10, w - 10));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Minus size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.stepValue}>{meadowWidth} m</Text>
              <Pressable
                onPress={() => {
                  setMeadowWidth((w) => Math.min(150, w + 10));
                  setSelectedPreset(null);
                }}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Plus size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </Card>

        {/* Action Button: Scan Quadrat */}
        <Pressable
          onPress={() => router.push("/capture")}
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
        >
          <Camera size={18} color={colors.surface} />
          <Text style={styles.actionBtnText}>Scan Quadrat Instead</Text>
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
    width: 36,
    height: 36,
    borderRadius: radius.md,
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
    width: 36,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  bannerDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  heroResultCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
  heroResultLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  heroResultValue: {
    fontSize: 40,
    fontWeight: fontWeight.heavy,
    color: colors.primaryDark,
    marginVertical: spacing.xs,
  },
  heroResultCaption: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  secondaryResultsGrid: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  secondaryResultItem: {
    flex: 1,
    alignItems: "center",
  },
  secondaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },
  secondaryResultLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  secondaryResultValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginVertical: 2,
  },
  secondaryResultSub: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  sectionHeader: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  presetRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  presetChipSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textAlign: "center",
  },
  presetChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: fontWeight.bold,
  },
  paramsCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardHeaderTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  paramRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  paramInfo: {
    flex: 1,
  },
  paramName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  paramHint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 1,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: 3,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stepValue: {
    minWidth: 64,
    textAlign: "center",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
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
