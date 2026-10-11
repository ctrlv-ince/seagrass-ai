import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  ClipboardList,
  Map,
  MoreHorizontal,
} from "lucide-react-native";
import { colors, fontSize, fontWeight, shadow } from "../theme";

export type NavTab = "home" | "surveys" | "map" | "more" |
  /* legacy aliases kept for compat */ "dashboard" | "scan" | "species" | "calc";

interface BottomNavBarProps {
  activeTab: NavTab;
}

const TAB_CONFIG = [
  { key: "home" as const, label: "Home", icon: House, route: "/" },
  { key: "surveys" as const, label: "Surveys", icon: ClipboardList, route: "/survey" },
  { key: "map" as const, label: "Map", icon: Map, route: "/map" },
  { key: "more" as const, label: "More", icon: MoreHorizontal, route: "/more" },
] as const;

// Map legacy tab names to new ones
function resolveTab(tab: NavTab): string {
  if (tab === "dashboard") return "home";
  if (tab === "scan" || tab === "species" || tab === "calc") return "more";
  return tab;
}

export function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === "ios" ? 12 : 8);
  const resolved = resolveTab(activeTab);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {TAB_CONFIG.map((tab) => {
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
      })}
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
    ...shadow.sm,
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
});
