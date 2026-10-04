import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { createLocalSurvey } from "@/db/repository";
import { useOfflineSync } from "@/hooks/useOfflineSync";

export default function NewSurveyScreen() {
  const { user } = useAuth();
  const { triggerSync } = useOfflineSync();
  const defaultName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "";

  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [userName, setUserName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a survey title.");
      return;
    }
    setIsSaving(true);
    try {
      await createLocalSurvey({
        title: title.trim(),
        location_name: locationName.trim() || undefined,
        surveyor_name: userName.trim() || undefined,
      });

      // Attempt background cloud sync immediately if online
      triggerSync().catch(() => {});

      Alert.alert("Success", "Survey recorded locally and queued for sync.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err: any) {
      Alert.alert("Save Error", err?.message || "Could not save survey locally.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Survey Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bolinao Transect 1"
        placeholderTextColor="#94a3b8"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Location Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Santiago Island"
        placeholderTextColor="#94a3b8"
        value={locationName}
        onChangeText={setLocationName}
      />

      <Text style={styles.label}>Recorded By</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#94a3b8"
        value={userName}
        onChangeText={setUserName}
      />

      <Pressable
        style={[styles.submitBtn, isSaving && styles.submitBtnDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.submitBtnText}>Create Survey</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  submitBtn: {
    backgroundColor: "#0d9488",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 28,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
