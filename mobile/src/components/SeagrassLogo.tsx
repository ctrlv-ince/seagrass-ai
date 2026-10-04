import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface SeagrassLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "full";
  showSubtitle?: boolean;
}

export function SeagrassLogo({
  size = "md",
  variant = "full",
  showSubtitle = true,
}: SeagrassLogoProps) {
  const pixelSizes = {
    sm: 30,
    md: 40,
    lg: 56,
  };

  const dim = pixelSizes[size] || 40;

  const LogoSvg = (
    <Svg width={dim} height={dim} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="mBladeGradPrimary" x1="20%" y1="100%" x2="80%" y2="0%">
          <Stop offset="0%" stopColor="#0f766e" />
          <Stop offset="50%" stopColor="#0d9488" />
          <Stop offset="100%" stopColor="#14b8a6" />
        </LinearGradient>

        <LinearGradient id="mBladeGradSecondary" x1="10%" y1="100%" x2="90%" y2="0%">
          <Stop offset="0%" stopColor="#047857" />
          <Stop offset="60%" stopColor="#10b981" />
          <Stop offset="100%" stopColor="#34d399" />
        </LinearGradient>

        <LinearGradient id="mWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#06b6d4" />
          <Stop offset="100%" stopColor="#0d9488" />
        </LinearGradient>

        <LinearGradient id="mBackdropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#f0fdfa" />
          <Stop offset="100%" stopColor="#ccfbf1" />
        </LinearGradient>
      </Defs>

      {/* Rounded Squircle Backdrop */}
      <Rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="26"
        fill="url(#mBackdropGrad)"
        stroke="#99f6e4"
        strokeWidth="2"
      />

      {/* Secondary Blade (Curved rear ribbon) */}
      <Path
        d="M52 78 C56 60 67 42 77 28 C68 44 60 62 56 78 Z"
        fill="url(#mBladeGradSecondary)"
        opacity={0.9}
      />

      {/* Primary Tapering Seagrass Blade (Upright central) */}
      <Path
        d="M44 80 C40 56 46 32 58 14 C54 36 49 60 46 80 Z"
        fill="url(#mBladeGradPrimary)"
      />

      {/* Tertiary Left Blade */}
      <Path
        d="M42 80 C36 64 29 48 23 38 C31 49 37 65 42 80 Z"
        fill="url(#mBladeGradPrimary)"
        opacity={0.75}
      />

      {/* Flowing Coastal Ocean Wave Swell */}
      <Path
        d="M14 74 C26 66 38 78 54 71 C68 65 80 73 90 68 C86 79 72 85 54 85 C36 85 22 81 14 74 Z"
        fill="url(#mWaveGrad)"
      />

      {/* Micro Wave Highlight Line */}
      <Path
        d="M18 73 C30 67 42 77 56 71 C68 66 79 73 86 69"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Marine Water Droplet Accent */}
      <Circle cx="68" cy="20" r="3" fill="#06b6d4" opacity={0.85} />
    </Svg>
  );

  if (variant === "icon") {
    return <View>{LogoSvg}</View>;
  }

  return (
    <View style={styles.container}>
      {LogoSvg}
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>SEAGRASS</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
        </View>
        {showSubtitle && (
          <Text style={styles.subtitle}>SPECS & WAVE ATTENUATION</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
