import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";

// Standard Mendez & Losada (2004) hydrodynamic vegetation damping solver
function computeWaveDamping(
  density: number,
  bladeLengthCm: number,
  waterDepthM: number,
  incidentWaveHeightM: number,
  wavePeriodS = 4.5,
  meadowWidthM = 50.0
) {
  const g = 9.80665;
  const h = Math.max(waterDepthM, 0.1);
  const H0 = Math.max(incidentWaveHeightM, 0.05);
  const N = Math.max(density, 1.0);
  const hv = Math.max(bladeLengthCm / 100.0, 0.02);
  const cd = 0.70;
  const bv = 0.01; // 1 cm average blade width

  // Shallow-to-intermediate water dispersion approximation
  const omega = (2 * Math.PI) / wavePeriodS;
  let k = omega / Math.sqrt(g * h); // Shallow seed
  for (let i = 0; i < 8; i++) {
    const kh = k * h;
    const f = g * k * Math.tanh(Math.min(kh, 20)) - omega * omega;
    const df = g * Math.tanh(Math.min(kh, 20)) + g * kh * (1 - Math.pow(Math.tanh(Math.min(kh, 20)), 2));
    if (Math.abs(df) > 1e-9) k -= f / df;
  }
  k = Math.max(k, 0.01);

  const le = Math.min(hv, h);
  const sinhKle = Math.sinh(Math.min(k * le, 20));
  const sinh2Kh = Math.sinh(Math.min(2 * k * h, 40));
  const num = Math.pow(sinhKle, 3) + 3 * sinhKle;
  const den = sinh2Kh + 2 * k * h;
  const kd = ((4 * cd * bv * N) / (9 * Math.PI)) * k * (num / Math.max(den, 0.01));

  // Transmitted wave height after passing through meadow
  const Hw = H0 / (1.0 + kd * H0 * meadowWidthM);
  const heightReductionPct = Math.min(Math.max((1.0 - Hw / H0) * 100.0, 0.0), 99.0);
  const energyDampingPct = Math.min(Math.max((1.0 - Math.pow(Hw / H0, 2)) * 100.0, 0.0), 99.9);

  return {
    inshoreHeight: parseFloat(Hw.toFixed(2)),
    heightReductionPct: parseFloat(heightReductionPct.toFixed(1)),
    energyDampingPct: parseFloat(energyDampingPct.toFixed(1)),
  };
}

const PRESETS = [
  { name: "Enhalus Ribbon", density: 240, bladeLength: 45, depth: 1.6, height: 0.9, width: 50 },
  { name: "Thalassia Reef", density: 380, bladeLength: 22, depth: 1.2, height: 0.75, width: 40 },
  { name: "Halodule Bed", density: 650, bladeLength: 12, depth: 0.9, height: 0.6, width: 35 },
];

export default function WaveCalcScreen() {
  const [density, setDensity] = useState(340);
  const [bladeLength, setBladeLength] = useState(30);
  const [depth, setDepth] = useState(1.5);
  const [waveHeight, setWaveHeight] = useState(0.8);
  const [meadowWidth, setMeadowWidth] = useState(50);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const results = useMemo(() => {
    return computeWaveDamping(density, bladeLength, depth, waveHeight, 4.5, meadowWidth);
  }, [density, bladeLength, depth, waveHeight, meadowWidth]);

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSelectedPreset(p.name);
    setDensity(p.density);
    setBladeLength(p.bladeLength);
    setDepth(p.depth);
    setWaveHeight(p.height);
    setMeadowWidth(p.width);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner */}
      <View style={styles.bannerCard}>
        <Text style={styles.bannerTag}>HYDRODYNAMIC CALCULATOR</Text>
        <Text style={styles.bannerTitle}>Field Wave Attenuation</Text>
        <Text style={styles.bannerSubtitle}>
          Mendez &amp; Losada (2004) physics model for on-site coastal damping prediction.
        </Text>
      </View>

      {/* Primary Results Display */}
      <View style={styles.resultsGrid}>
        <View style={styles.primaryResultCard}>
          <Text style={styles.resultLabel}>ENERGY DISSIPATION</Text>
          <Text style={styles.primaryResultValue}>-{results.energyDampingPct}%</Text>
          <Text style={styles.resultCaption}>Total kinetic wave energy absorbed</Text>
        </View>

        <View style={styles.secondaryResultsRow}>
          <View style={styles.secondaryResultCard}>
            <Text style={styles.resultLabel}>HEIGHT REDUCTION</Text>
            <Text style={styles.secondaryResultValue}>-{results.heightReductionPct}%</Text>
            <Text style={styles.resultCaption}>Wave crest decay</Text>
          </View>

          <View style={styles.secondaryResultCard}>
            <Text style={styles.resultLabel}>INSHORE WAVE</Text>
            <Text style={styles.secondaryResultValue}>{results.inshoreHeight} m</Text>
            <Text style={styles.resultCaption}>From {waveHeight}m incident</Text>
          </View>
        </View>
      </View>

      {/* Preset Quick Buttons */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Meadow Presets</Text>
        <View style={styles.presetRow}>
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.name;
            return (
              <Pressable
                key={p.name}
                onPress={() => applyPreset(p)}
                style={[styles.presetButton, isSelected && styles.presetButtonSelected]}
              >
                <Text style={[styles.presetText, isSelected && styles.presetTextSelected]}>
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Adjustable Parameter Steppers */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Field Parameters</Text>

        {/* Shoot Density */}
        <View style={styles.paramRow}>
          <View>
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
            >
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{density}</Text>
            <Pressable
              onPress={() => {
                setDensity((d) => Math.min(1200, d + 50));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Blade Length */}
        <View style={styles.paramRow}>
          <View>
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
            >
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{bladeLength} cm</Text>
            <Pressable
              onPress={() => {
                setBladeLength((l) => Math.min(100, l + 5));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Water Depth */}
        <View style={styles.paramRow}>
          <View>
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
            >
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{depth.toFixed(1)} m</Text>
            <Pressable
              onPress={() => {
                setDepth((d) => Math.min(8.0, parseFloat((d + 0.2).toFixed(1))));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Incident Wave Height */}
        <View style={styles.paramRow}>
          <View>
            <Text style={styles.paramName}>Offshore Wave (H₀)</Text>
            <Text style={styles.paramHint}>incident height (m)</Text>
          </View>
          <View style={styles.stepperContainer}>
            <Pressable
              onPress={() => {
                setWaveHeight((h) => Math.max(0.2, parseFloat((h - 0.1).toFixed(2))));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{waveHeight.toFixed(2)} m</Text>
            <Pressable
              onPress={() => {
                setWaveHeight((h) => Math.min(3.0, parseFloat((h + 0.1).toFixed(2))));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Meadow Width */}
        <View style={styles.paramRow}>
          <View>
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
            >
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{meadowWidth} m</Text>
            <Pressable
              onPress={() => {
                setMeadowWidth((w) => Math.min(150, w + 10));
                setSelectedPreset(null);
              }}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Action Button: Scan Quadrat */}
      <Pressable onPress={() => router.push("/capture")} style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Scan Quadrat Camera Instead</Text>
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
  bannerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    lineHeight: 17,
  },
  resultsGrid: {
    gap: 10,
  },
  primaryResultCard: {
    backgroundColor: "#f0fdfa",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#99f6e4",
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  primaryResultValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#042f2e",
    marginVertical: 4,
  },
  resultCaption: {
    fontSize: 11,
    color: "#0f766e",
  },
  secondaryResultsRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryResultCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryResultValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginVertical: 4,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  presetButtonSelected: {
    borderColor: "#0d9488",
    backgroundColor: "#ccfbf1",
  },
  presetText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  presetTextSelected: {
    color: "#0f766e",
    fontWeight: "700",
  },
  paramRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  paramName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  paramHint: {
    fontSize: 10,
    color: "#94a3b8",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  stepValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
    minWidth: 54,
    textAlign: "center",
  },
  actionBtn: {
    backgroundColor: "#0d9488",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
