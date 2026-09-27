import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { router } from "expo-router";

export default function NewSurveyScreen() {
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [surveyorName, setSurveyorName] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a survey title.");
      return;
    }
    // In actual implementation, writes to SQLite and triggers sync
    Alert.alert("Success", "Survey created locally.", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Survey Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bolinao Transect 1"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Location Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Santiago Island"
        value={locationName}
        onChangeText={setLocationName}
      />

      <Text style={styles.label}>Surveyor Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Marine Biologist A"
        value={surveyorName}
        onChangeText={setSurveyorName}
      />

      <Pressable style={styles.submitBtn} onPress={handleSave}>
        <Text style={styles.submitBtnText}>Create Survey</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#f8fafc",
  },
  submitBtn: {
    backgroundColor: "#0d9488",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 28,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
