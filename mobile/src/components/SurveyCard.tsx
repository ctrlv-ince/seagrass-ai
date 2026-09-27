/**
 * Survey card component for survey list display.
 */
import { View, Text, Pressable, StyleSheet } from "react-native";

interface SurveyCardProps {
  title: string;
  locationName?: string;
  status: string;
  onPress?: () => void;
}

export function SurveyCard({
  title,
  locationName,
  status,
  onPress,
}: SurveyCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {locationName && (
        <Text style={styles.location}>{locationName}</Text>
      )}
      <Text style={styles.status}>{status}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: "#059669",
    marginTop: 8,
    textTransform: "capitalize",
  },
});
