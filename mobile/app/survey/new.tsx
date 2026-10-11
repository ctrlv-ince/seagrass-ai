import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, ClipboardPlus, MapPin, User, FileText } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { createLocalSurvey } from "@/db/repository";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Card } from "@/components/ui/Card";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

export default function NewSurveyScreen() {
  const insets = useSafeAreaInsets();
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
      Alert.alert("Required Field", "Please provide a survey title.");
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

      Alert.alert(
        "Survey Created",
        "Survey recorded locally and queued for synchronization.",
        [{ text: "OK", onPress: () => router.replace("/survey") }]
      );
    } catch (err: any) {
      Alert.alert("Save Error", err?.message || "Could not save survey locally.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>New Survey Session</Text>
        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FileText size={15} color={colors.textSecondary} />
              <Text style={styles.label}>Survey Title *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bolinao Transect 1"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MapPin size={15} color={colors.textSecondary} />
              <Text style={styles.label}>Location Name</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Santiago Island, Pangasinan"
              placeholderTextColor={colors.textTertiary}
              value={locationName}
              onChangeText={setLocationName}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <User size={15} color={colors.textSecondary} />
              <Text style={styles.label}>Recorded By</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Your name or team"
              placeholderTextColor={colors.textTertiary}
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              isSaving && styles.submitBtnDisabled,
              pressed && styles.submitBtnPressed,
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.surface} size="small" />
            ) : (
              <>
                <ClipboardPlus size={18} color={colors.surface} />
                <Text style={styles.submitBtnText}>Create Survey</Text>
              </>
            )}
          </Pressable>
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
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs + 2,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: fontSize.sm,
    backgroundColor: colors.surfaceSecondary,
    color: colors.text,
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  submitBtnPressed: {
    opacity: 0.9,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
});
