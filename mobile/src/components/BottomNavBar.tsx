import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  ClipboardList,
  Map,
  MoreHorizontal,
  Camera,
} from "lucide-react-native";
import { colors, fontSize, fontWeight, shadow } from "../theme";

export type NavTab = "home" | "surveys" | "map" | "more" |
  /* legacy aliases kept for compat */ "dashboard" | "scan" | "species" | "calc";

interface BottomNavBarProps {
  activeTab: NavTab;
}

const LEFT_TABS = [
  { key: "home" as const, label: "Home", icon: House, route: "/" },
  { key: "surveys" as const, label: "Surveys", icon: ClipboardList, route: "/survey" },
] as const;

const RIGHT_TABS = [
  { key: "map" as const, label: "Map", icon: Map, route: "/map" },
  { key: "more" as const, label: "More", icon: MoreHorizontal, route: "/more" },
] as const;

function resolveTab(tab: NavTab): string {
  if (tab === "dashboard") return "home";
  if (tab === "scan" || tab === "species" || tab === "calc") return "more";
  return tab;
}

export function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === "ios" ? 12 : 8);
  const resolved = resolveTab(activeTab);

  const renderTab = (tab: { key: string; label: string; icon: any; route: string }) => {
    const isActive = resolved === tab.key;
    const IconComponent = tab.icon;

    return (
      <Pressable
        key={tab.key}
        style={styles.tabItem}
        onPress={() => {
          if (!isActive) router.replace(tab.route as any);
        }}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <IconComponent
            size={20}
            color={isActive ? colors.primary : colors.textTertiary}
            strokeWidth={isActive ? 2.2 : 1.6}
          />
        </View>
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* Left Tabs */}
      {LEFT_TABS.map(renderTab)}

      {/* Center Floating Scan FAB */}
      <Pressable
        style={({ pressed }) => [
          styles.fabWrapper,
          pressed && styles.fabPressed,
        ]}
        onPress={() => router.push("/capture")}
        accessibilityRole="button"
        accessibilityLabel="Scan Quadrat Camera"
        hitSlop={8}
      >
        <View style={styles.fabInner}>
          <Camera size={22} color={colors.textOnPrimary} strokeWidth={2.2} />
        </View>
        <Text style={styles.fabLabel}>Scan</Text>
      </Pressable>

      {/* Right Tabs */}
      {RIGHT_TABS.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 6,
    ...shadow.md,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.primarySubtle,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },

  /* Center Floating Scan FAB */
  fabWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: -12,
    width: 60,
  },
  fabInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadow.md,
  },
  fabPressed: {
    transform: [{ scale: 0.94 }],
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: 1,
  },
});
