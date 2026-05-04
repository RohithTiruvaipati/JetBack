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
import { isValidEmail, isValidPassword } from "@/components/auth/authValidation";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { AuthStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<AuthStackParamList, "CreateAccount"> & {
  onSignedIn: () => void;
};

export function CreateAccountScreen({ navigation, onSignedIn }: Props) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function createAccount() {
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Email must be 4–20 characters and include both @ and .");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters and include 1 special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    onSignedIn();
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Join JetBack and start your journey">
      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={authStyles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.subtext}
            autoCapitalize="words"
            style={authStyles.input}
          />
        </View>
        <View style={styles.col}>
          <Text style={authStyles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.subtext}
            autoCapitalize="words"
            style={authStyles.input}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={authStyles.label}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={(v) => setEmail(v.slice(0, 20))}
          placeholder="Email address"
          placeholderTextColor={colors.subtext}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={authStyles.input}
          maxLength={20}
        />
      </View>

      <View style={styles.section}>
        <Text style={authStyles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={authStyles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={authStyles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={authStyles.input}
        />
      </View>

      <Pressable
        onPress={() => setAgree((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agree }}
        style={styles.checkboxRow}
      >
        <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
          {agree && <FontAwesome name="check" size={12} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>
          I agree to the <Text style={authStyles.link}>Terms of Service</Text> and{" "}
          <Text style={authStyles.link}>Privacy Policy</Text>
        </Text>
      </Pressable>

      <Pressable onPress={createAccount} style={authStyles.primaryButton}>
        <Text style={authStyles.primaryButtonText}>Create Account</Text>
      </Pressable>

      {!!error && <Text style={authStyles.errorText}>{error}</Text>}

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate("Login")} accessibilityRole="button">
          <Text style={authStyles.link}>Sign In</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  twoCol: { flexDirection: "row", gap: 10, marginBottom: 12 },
  col: { flex: 1 },
  section: { marginBottom: 12 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  checkboxText: { ...typography.caption, color: colors.subtext, flex: 1, lineHeight: 18 },
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: { ...typography.caption, color: colors.subtext },
});
