import React from "react";
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
  Waves,
  BookOpen,
  Settings,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { colors, spacing, fontSize, fontWeight, radius } from "@/theme";

interface MenuItem {
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Species Guide",
    description: "Field identification keys and damping ratings",
    icon: <BookOpen size={20} color={colors.primary} />,
    route: "/species",
  },
  {
    label: "Wave Calculator",
    description: "Mendez & Losada attenuation model",
    icon: <Waves size={20} color={colors.primary} />,
    route: "/wave-calc",
  },
  {
    label: "Settings",
    description: "Profile, cloud status, and local storage",
    icon: <Settings size={20} color={colors.textSecondary} />,
    route: "/settings",
  },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>More</Text>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.route}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.description}</Text>
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* About section */}
        <View style={styles.aboutCard}>
          <Info size={16} color={colors.textTertiary} />
          <View style={styles.aboutText}>
            <Text style={styles.aboutTitle}>Seagrass DSS</Text>
            <Text style={styles.aboutDesc}>
              Decision Support System for coastal seagrass monitoring, species
              detection, and wave attenuation analysis.
            </Text>
          </View>
        </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  menuList: {
    gap: spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  menuDesc: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  aboutCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
  },
  aboutText: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  aboutDesc: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
    lineHeight: 16,
  },
});
