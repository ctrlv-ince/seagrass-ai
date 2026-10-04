import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { GPSBadge } from "@/components/GPSBadge";
import { OfflineBanner } from "@/components/OfflineBanner";
import { SeagrassLogo } from "@/components/SeagrassLogo";
import { useAuth } from "@/hooks/useAuth";

const MOCK_SURVEYS = [
  {
    id: "1",
    title: "Bolinao Inshore Meadow",
    locationName: "Santiago Island, Pangasinan",
    status: "completed",
    species: "Enhalus acoroides",
    coverage: "76.5%",
    waveAttenuation: "-58.4%",
  },
  {
    id: "2",
    title: "Puerto Galera Transect 3",
    locationName: "Sabang Bay, Mindoro",
    status: "in-progress",
    species: "Thalassia hemprichii",
    coverage: "64.0%",
    waveAttenuation: "-48.2%",
  },
  {
    id: "3",
    title: "Balingasay Coastal Site",
    locationName: "Balingasay, Pangasinan",
    status: "completed",
    species: "Halodule pinifolia",
    coverage: "82.1%",
    waveAttenuation: "-64.0%",
  },
];

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <View style={styles.container}>
      <OfflineBanner isOffline={false} pendingCount={0} />

      {/* Brand Header with SeagrassLogo */}
      <View style={styles.brandRow}>
        <SeagrassLogo size="sm" variant="full" />
        <Pressable onPress={() => router.push("/settings")} style={styles.settingsIconBtn}>
          <Text style={styles.settingsIconText}>⚙️</Text>
        </Pressable>
      </View>

      {/* User Status Bar */}
      <View style={styles.userBar}>
        <View style={styles.userBarLeft}>
          <Text style={styles.userGreeting}>
            Hello, <Text style={styles.userNameText}>{userName}</Text>
          </Text>
          <Text style={styles.userSub}>Coastal Seagrass Field System</Text>
        </View>

        <View style={styles.userBarRight}>
          {user ? (
            <Pressable style={styles.authActionBtn} onPress={() => signOut()}>
              <Text style={styles.authActionText}>Sign Out</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.authActionBtnHighlight}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.authActionTextHighlight}>Sign In</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Quick Action Navigation Grid */}
      <View style={styles.toolsRow}>
        <Pressable style={styles.toolChip} onPress={() => router.push("/capture")}>
          <Text style={styles.toolEmoji}>📷</Text>
          <Text style={styles.toolLabel}>Scan Quadrat</Text>
        </Pressable>
        <Pressable style={styles.toolChip} onPress={() => router.push("/wave-calc")}>
          <Text style={styles.toolEmoji}>🌊</Text>
          <Text style={styles.toolLabel}>Wave Calc</Text>
        </Pressable>
        <Pressable style={styles.toolChip} onPress={() => router.push("/map")}>
          <Text style={styles.toolEmoji}>📍</Text>
          <Text style={styles.toolLabel}>Field Map</Text>
        </Pressable>
        <Pressable style={styles.toolChip} onPress={() => router.push("/species")}>
          <Text style={styles.toolEmoji}>📖</Text>
          <Text style={styles.toolLabel}>Species</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Surveys</Text>
        <Pressable onPress={() => router.push("/survey/new")} style={styles.newSurveyBtn}>
          <Text style={styles.newSurveyBtnText}>+ New Survey</Text>
        </Pressable>
      </View>

      <FlatList
        data={MOCK_SURVEYS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/survey/${item.id}`)}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text
                style={[
                  styles.statusPill,
                  item.status === "completed"
                    ? styles.statusCompleted
                    : styles.statusInProgress,
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.cardLocation}>📍 {item.locationName}</Text>

            <View style={styles.cardStatsRow}>
              <View style={styles.statChip}>
                <Text style={styles.statChipLabel}>SPECIES</Text>
                <Text style={styles.statChipValItalic}>{item.species}</Text>
              </View>

              <View style={styles.statChip}>
                <Text style={styles.statChipLabel}>COVERAGE</Text>
                <Text style={styles.statChipVal}>{item.coverage}</Text>
              </View>

              <View style={[styles.statChip, styles.statChipWave]}>
                <Text style={styles.statChipLabelWave}>WAVE DISSIPATION</Text>
                <Text style={styles.statChipValWave}>{item.waveAttenuation}</Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No surveys found. Start a new one below.</Text>
        }
      />

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => router.push("/capture")}
        >
          <Text style={styles.primaryBtnText}>📷 Scan Seagrass</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => router.push("/survey/new")}
        >
          <Text style={styles.secondaryBtnText}>+ New Survey</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => router.push("/map")}
        >
          <Text style={styles.secondaryBtnText}>🗺️ Map</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
  },
  settingsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIconText: {
    fontSize: 16,
  },
  toolsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  toolChip: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  toolEmoji: {
    fontSize: 18,
  },
  toolLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
  },
  newSurveyBtn: {
    backgroundColor: "#f0fdfa",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#99f6e4",
  },
  newSurveyBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f766e",
  },
  userBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  userBarLeft: {
    flex: 1,
  },
  userGreeting: {
    fontSize: 14,
    color: "#334155",
  },
  userNameText: {
    fontWeight: "700",
    color: "#0f172a",
  },
  userSub: {
    fontSize: 11,
    color: "#64748b",
  },
  userBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  authActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
  },
  authActionText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  authActionBtnHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0d9488",
  },
  authActionTextHighlight: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "700",
  },
  quickScanCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#f0fdfa",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#99f6e4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickScanTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  quickScanTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f766e",
  },
  quickScanDesc: {
    fontSize: 11,
    color: "#334155",
    marginTop: 2,
    lineHeight: 15,
  },
  quickScanBtn: {
    backgroundColor: "#0d9488",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quickScanBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  listContent: {
    padding: 16,
    paddingTop: 6,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  statusPill: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
  },
  statusInProgress: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },
  cardLocation: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  cardStatsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  statChip: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statChipLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#64748b",
  },
  statChipVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 1,
  },
  statChipValItalic: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0d9488",
    fontStyle: "italic",
    marginTop: 1,
  },
  statChipWave: {
    backgroundColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
  statChipLabelWave: {
    fontSize: 8,
    fontWeight: "700",
    color: "#0f766e",
  },
  statChipValWave: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0d9488",
    marginTop: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 32,
    fontSize: 14,
  },
  actionBar: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "#0d9488",
    flex: 1.3,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  secondaryBtn: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  secondaryBtnText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 12,
  },
});
