import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { z } from "zod";

const ParamsSchema = z.object({
  id: z.string().min(1),
});

export default function SurveyDetailScreen() {
  const rawParams = useLocalSearchParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  if (!parsed.success) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid survey identifier.</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const { id } = parsed.data;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Survey #{id}</Text>
        <Text style={styles.meta}>Status: Completed</Text>
        <Text style={styles.meta}>Quadrats captured: 12</Text>
        <Text style={styles.meta}>Estimated coverage: 68%</Text>
      </View>

      <Pressable
        style={styles.actionBtn}
        onPress={() => router.push("/capture")}
      >
        <Text style={styles.actionBtnText}>+ Add Quadrat Photo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  meta: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 8,
  },
  actionBtn: {
    backgroundColor: "#0d9488",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  backBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
  backBtnText: {
    color: "#0d9488",
    fontSize: 14,
    fontWeight: "600",
  },
});
