import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsScreen() {
  const { user, signOut, isConfigured } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user?.email || "Offline User Session"}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoVal}>Field User</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Authentication</Text>
          <Text style={styles.infoVal}>Supabase Auth</Text>
        </View>
      </View>

      {/* Connectivity & Cloud Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Backend &amp; Database</Text>

        <View style={styles.statusItem}>
          <View style={styles.statusDot} />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusName}>Supabase PostgreSQL + PostGIS</Text>
            <Text style={styles.statusDetail}>
              {isConfigured ? "Connected (aws-0-ap-southeast-2)" : "Demo Sandbox Mode"}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <View style={styles.statusDot} />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusName}>Object Storage (seagrass-images)</Text>
            <Text style={styles.statusDetail}>Public CDN Active</Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: "#0d9488" }]} />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusName}>FastAPI Detection Engine</Text>
            <Text style={styles.statusDetail}>http://localhost:8000/api/v1</Text>
          </View>
        </View>
      </View>

      {/* Offline Storage Cache */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Field Offline Cache</Text>
        <Text style={styles.cacheDesc}>
          Surveys and quadrat photos are stored locally on device and automatically synced to Supabase when internet connectivity is detected.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cached Surveys</Text>
          <Text style={styles.infoVal}>3 sessions</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Offline Queue</Text>
          <Text style={styles.infoVal}>All photos synced</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
        <Text style={styles.signOutText}>Sign Out</Text>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0d9488",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  infoVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginTop: 4,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  statusDetail: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
  },
  cacheDesc: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
  },
  signOutBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fecdd3",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  signOutText: {
    color: "#e11d48",
    fontWeight: "700",
    fontSize: 14,
  },
});
