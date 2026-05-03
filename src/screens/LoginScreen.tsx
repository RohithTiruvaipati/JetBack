import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authStyles } from "@/components/auth/AuthStyles";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { AuthStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login"> & {
  onSignedIn: () => void;
};

export function LoginScreen({ navigation, onSignedIn }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const passwordRef = React.useRef<TextInput>(null);

  function signIn() {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@") || password.length < 1) {
      setError("Please enter your email and password.");
      return;
    }
    onSignedIn();
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your journey">
      <View style={styles.section}>
        <Text style={authStyles.label}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={authStyles.input}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
      </View>

      <View style={styles.section}>
        <Text style={authStyles.label}>Password</Text>
        <TextInput
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={authStyles.input}
          returnKeyType="go"
          onSubmitEditing={signIn}
        />
        <Pressable
          onPress={() => navigation.navigate("ForgotPassword")}
          accessibilityRole="button"
          style={styles.forgotWrap}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>

      <Pressable onPress={signIn} style={authStyles.primaryButton}>
        <Text style={authStyles.primaryButtonText}>Sign In</Text>
      </Pressable>

      {!!error && <Text style={authStyles.errorText}>{error}</Text>}

      <View style={authStyles.dividerRow}>
        <View style={authStyles.divider} />
        <Text style={authStyles.dividerText}>or</Text>
        <View style={authStyles.divider} />
      </View>

      <View style={styles.socialGrid}>
        <Pressable
          style={authStyles.socialButton}
          onPress={onSignedIn}
          accessibilityRole="button"
        >
          <FontAwesome name="google" size={18} color={colors.text} />
          <Text style={authStyles.socialButtonText}>Continue with Google</Text>
        </Pressable>
        <Pressable
          style={authStyles.socialButton}
          onPress={onSignedIn}
          accessibilityRole="button"
        >
          <FontAwesome name="apple" size={18} color={colors.text} />
          <Text style={authStyles.socialButtonText}>Continue with Apple</Text>
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>New here? </Text>
        <Pressable
          onPress={() => navigation.navigate("CreateAccount")}
          accessibilityRole="button"
        >
          <Text style={authStyles.link}>Create Account</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 12 },
  forgotWrap: { alignSelf: "flex-end", marginTop: 10 },
  forgotText: { ...typography.caption, color: colors.orange, fontWeight: "700" },
  socialGrid: { gap: 10 },
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: { ...typography.caption, color: colors.subtext },
});
