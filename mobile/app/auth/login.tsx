import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SeagrassLogo } from "@/components/SeagrassLogo";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { colors, spacing, radius, fontSize, fontWeight } from "@/theme";

export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        router.replace("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      } else {
        router.replace("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.brandHeader}>
          <SeagrassLogo size="lg" variant="full" />
        </View>

        {/* Demo sandbox notice */}
        {!isConfigured && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>
              Demo Sandbox: Sign in with any credentials or Google to access all features.
            </Text>
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Auth Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {/* Google Button */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or with email</Text>
            <View style={styles.divider} />
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="user@example.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              loading && styles.submitBtnDisabled,
              pressed && styles.btnPressed,
            ]}
            onPress={handleEmailSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/auth/register")}>
              <Text style={styles.footerLink}>Create Account</Text>
            </Pressable>
          </View>
        </Card>

        {/* Skip to app button */}
        <Pressable
          style={styles.skipBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.skipBtnText}>Continue as Guest →</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
    paddingTop: 48,
    justifyContent: "center",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  demoBanner: {
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  demoBannerText: {
    fontSize: fontSize.xs,
    color: colors.primaryDark,
    textAlign: "center",
    lineHeight: 17,
  },
  errorBanner: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    fontSize: fontSize.xs,
    color: colors.error,
    textAlign: "center",
  },
  card: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  googleBtn: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: "center",
  },
  googleBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xs,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.surface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  btnPressed: {
    opacity: 0.9,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  skipBtn: {
    alignItems: "center",
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
  skipBtnText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
});
