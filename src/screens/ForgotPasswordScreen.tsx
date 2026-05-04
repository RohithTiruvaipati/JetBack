import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authStyles } from "@/components/auth/AuthStyles";
import { isValidEmail } from "@/components/auth/authValidation";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { AuthStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function submit() {
    setError(null);
    if (!isValidEmail(email)) {
      setError("Email must be 4–20 characters and include both @ and .");
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email address and we'll send you instructions to reset your password."
      footer={
        <Pressable onPress={() => {}} accessibilityRole="button">
          <Text style={styles.helpText}>
            Need help? <Text style={authStyles.link}>Contact Support</Text>
          </Text>
        </Pressable>
      }
    >
      {!sent ? (
        <>
          <View style={styles.section}>
            <Text style={authStyles.label}>Email Address</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail-outline" size={18} color={colors.subtext} />
              <TextInput
                value={email}
                onChangeText={(v) => setEmail(v.slice(0, 20))}
                placeholder="Email address"
                placeholderTextColor={colors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputInner}
                maxLength={20}
              />
            </View>
          </View>

          <Pressable onPress={submit} style={authStyles.primaryButton}>
            <Text style={authStyles.primaryButtonText}>Send Reset Instructions</Text>
          </Pressable>
          {!!error && <Text style={authStyles.errorText}>{error}</Text>}

          <Pressable
            onPress={() => navigation.navigate("Login")}
            accessibilityRole="button"
            style={styles.backRow}
          >
            <Ionicons name="arrow-back" size={16} color={colors.subtext} />
            <Text style={styles.backText}>Back to Login</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.sentWrap}>
          <View style={styles.sentIcon}>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </View>
          <Text style={styles.sentTitle}>Check your inbox</Text>
          <Text style={styles.sentBody}>
            If an account exists for {email.trim()}, we sent reset instructions.
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={authStyles.primaryButton}
            accessibilityRole="button"
          >
            <Text style={authStyles.primaryButtonText}>Back to Login</Text>
          </Pressable>
        </View>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 12 },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 12,
  },
  inputInner: { flex: 1, color: colors.text },
  backRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { ...typography.caption, color: colors.subtext, fontWeight: "600" },
  helpText: { ...typography.caption, color: colors.subtext },
  sentWrap: { alignItems: "center", gap: 10, paddingVertical: 10 },
  sentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  sentTitle: { ...typography.h2, color: colors.text },
  sentBody: { ...typography.body, color: colors.subtext, textAlign: "center" },
});
