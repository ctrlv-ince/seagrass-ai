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
  Camera,
  ClipboardList,
  ShieldCheck,
  Cpu,
  Database,
  User,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { colors, spacing, fontSize, fontWeight, radius } from "@/theme";

interface SectionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  iconBg: string;
  iconColor: string;
  route: string;
  badge?: string;
}

const SCIENTIFIC_TOOLS: SectionItem[] = [
  {
    id: "species",
    label: "Species Guide",
    description: "Indo-Pacific taxonomic keys, blade traits & damping scores",
    icon: BookOpen,
    iconBg: colors.primarySubtle,
    iconColor: colors.primary,
    route: "/species",
    badge: "8 Taxa",
  },
  {
    id: "wave-calc",
    label: "Wave Attenuation Calculator",
    description: "Mendez & Losada (2004) hydrodynamic decay simulation",
    icon: Waves,
    iconBg: "rgba(6, 182, 212, 0.12)",
    iconColor: colors.accent,
    route: "/wave-calc",
    badge: "Physics",
  },
  {
    id: "quadrat-cam",
    label: "Benthic Quadrat Camera",
    description: "Live 50×50cm quadrat transect reticle & YOLOv11 segmentation",
    icon: Camera,
    iconBg: "rgba(16, 185, 129, 0.12)",
    iconColor: colors.success,
    route: "/capture",
  },
];

const DATA_SECTION: SectionItem[] = [
  {
    id: "surveys",
    label: "Survey Records",
    description: "Local SQLite transect logs and pending cloud synchronization",
    icon: ClipboardList,
    iconBg: colors.primarySubtle,
    iconColor: colors.primary,
    route: "/survey",
  },
  {
    id: "settings",
    label: "Settings & Cloud Sync",
    description: "Supabase connection, offline storage and device diagnostics",
    icon: Settings,
    iconBg: colors.surfaceSecondary,
    iconColor: colors.textSecondary,
    route: "/settings",
  },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  const renderSectionItem = (item: SectionItem) => {
    const Icon = item.icon;
    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.menuItem,
          pressed && styles.menuItemPressed,
        ]}
        onPress={() => router.push(item.route as any)}
        accessibilityRole="button"
        accessibilityLabel={item.label}
      >
        <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
          <Icon size={20} color={item.iconColor} />
        </View>

        <View style={styles.menuText}>
          <View style={styles.labelRow}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge && (
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.menuDesc}>{item.description}</Text>
        </View>

        <ChevronRight size={18} color={colors.textTertiary} />
      </Pressable>
    );
  };

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

        {/* Profile / Research Station Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <User size={24} color={colors.primary} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Marine Field Researcher</Text>
            <Text style={styles.profileRole}>Coastal Ecology Telemetry Station</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Edge SQLite Active • Offline-Ready</Text>
            </View>
          </View>
        </View>

        {/* Group 1: Scientific Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SCIENTIFIC TOOLS</Text>
          <View style={styles.menuCard}>
            {SCIENTIFIC_TOOLS.map(renderSectionItem)}
          </View>
        </View>

        {/* Group 2: Data & Diagnostics */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATA & SYSTEM</Text>
          <View style={styles.menuCard}>
            {DATA_SECTION.map(renderSectionItem)}
          </View>
        </View>

        {/* Group 3: Scientific Platform Specs Card */}
        <View style={styles.specsCard}>
          <View style={styles.specsHeader}>
            <ShieldCheck size={18} color={colors.primary} />
            <Text style={styles.specsTitle}>Scientific Telemetry Platform</Text>
          </View>

          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Cpu size={14} color={colors.textSecondary} />
              <Text style={styles.specLabel}>Vision Engine:</Text>
              <Text style={styles.specVal}>YOLOv11s-seg</Text>
            </View>
            <View style={styles.specItem}>
              <Waves size={14} color={colors.textSecondary} />
              <Text style={styles.specLabel}>Wave Physics:</Text>
              <Text style={styles.specVal}>Mendez-Losada (2004)</Text>
            </View>
            <View style={styles.specItem}>
              <Database size={14} color={colors.textSecondary} />
              <Text style={styles.specLabel}>Local DB:</Text>
              <Text style={styles.specVal}>expo-sqlite WAL</Text>
            </View>
          </View>

          <Text style={styles.specsFooter}>
            Seagrass AI DSS • Version 1.2.4-scientific • Seagrass-Watch Standard
          </Text>
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
    paddingBottom: spacing.xxxl + 20,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.md,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  profileRole: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primaryDark,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textTertiary,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  itemBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  menuDesc: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
    lineHeight: 16,
  },
  specsCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  specsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  specsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  specsGrid: {
    gap: spacing.xs,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  specLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  specVal: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  specsFooter: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    textAlign: "center",
  },
});
