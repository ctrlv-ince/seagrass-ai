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
  ArrowLeft,
  User,
  ShieldCheck,
  HardDrive,
  LogIn,
  LogOut,
  Globe,
  Radio,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, isConfigured } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest Researcher";

  const userEmail = user?.email || "Not signed in";
  const isAuthenticated = !!user;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => (router.canGoBack() ? router.back() : router.push("/more"))}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Settings & Profile</Text>
        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <Card style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <User size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Role</Text>
            </View>
            <Text style={styles.infoVal}>
              {isAuthenticated ? "Field Researcher" : "Guest"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <ShieldCheck size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Authentication</Text>
            </View>
            <Text
              style={[
                styles.infoVal,
                isAuthenticated ? styles.infoValHighlight : null,
              ]}
            >
              {isAuthenticated ? "Supabase Authenticated" : "Not Signed In"}
            </Text>
          </View>

          {/* Sign In or Sign Out Action */}
          {isAuthenticated ? (
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.signOutBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <LogOut size={16} color={colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/auth/login")}
              style={({ pressed }) => [
                styles.signInBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <LogIn size={16} color={colors.surface} />
              <Text style={styles.signInText}>Sign In / Create Account</Text>
            </Pressable>
          )}
        </Card>

        {/* Connectivity & Backend Status */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Backend & Connectivity</Text>

          <View style={styles.statusItem}>
            <View style={styles.statusIconWrap}>
              <Radio size={16} color={colors.primary} />
            </View>
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusName}>API Endpoint</Text>
              <Text style={styles.statusDetail} numberOfLines={1}>
                {apiUrl}
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusDot,
                isConfigured ? styles.statusDotActive : null,
              ]}
            />
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusName}>Supabase PostgreSQL + PostGIS</Text>
              <Text style={styles.statusDetail}>
                {isConfigured ? "Connected (Cloud Instance)" : "Sandbox / Local Mode"}
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <View style={[styles.statusDot, styles.statusDotActive]} />
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusName}>CARTO Basemaps & Satellite</Text>
              <Text style={styles.statusDetail}>CARTO Voyager Raster Active</Text>
            </View>
          </View>
        </Card>

        {/* Local Offline Cache */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Local Storage & Cache</Text>
          <Text style={styles.cacheDesc}>
            Field surveys and quadrat photos are stored locally on SQLite and automatically synchronized when network connectivity is detected.
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <HardDrive size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Local Database Engine</Text>
            </View>
            <Text style={styles.infoVal}>SQLite (expo-sqlite)</Text>
          </View>
        </Card>
      </ScrollView>
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
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.surface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  infoValHighlight: {
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  statusIconWrap: {
    width: 24,
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
    marginLeft: 8,
  },
  statusDotActive: {
    backgroundColor: colors.success,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  statusDetail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  cacheDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 4,
  },
  signOutText: {
    color: colors.error,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 4,
  },
  signInText: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
