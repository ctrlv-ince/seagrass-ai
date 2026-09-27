import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { SurveyCard } from "@/components/SurveyCard";
import { GPSBadge } from "@/components/GPSBadge";
import { OfflineBanner } from "@/components/OfflineBanner";

const MOCK_SURVEYS = [
  {
    id: "1",
    title: "Bolinao Meadow Survey A",
    locationName: "Bolinao, Pangasinan",
    status: "completed",
  },
  {
    id: "2",
    title: "Puerto Galera Transect 3",
    locationName: "Puerto Galera, Oriental Mindoro",
    status: "in-progress",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <OfflineBanner isOffline={false} pendingCount={0} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Surveys</Text>
        <GPSBadge isActive={true} accuracy={4.2} />
      </View>

      <FlatList
        data={MOCK_SURVEYS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurveyCard
            title={item.title}
            locationName={item.locationName}
            status={item.status}
            onPress={() => router.push(`/survey/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No surveys found. Start a new one below.</Text>
        }
      />

      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => router.push("/survey/new")}
        >
          <Text style={styles.primaryBtnText}>+ New Survey</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => router.push("/capture")}
        >
          <Text style={styles.secondaryBtnText}>📷 Capture</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 32,
    fontSize: 14,
  },
  actionBar: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "#0d9488",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  secondaryBtnText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
});
