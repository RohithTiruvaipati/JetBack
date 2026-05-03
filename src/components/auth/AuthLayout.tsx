import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="airplane" size={20} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.card}>{children}</View>

        {!!footer && <View style={styles.footer}>{footer}</View>}

        <Text style={styles.copyright}>© 2026 JetBack. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
  },
  brand: { width: "100%", alignItems: "center", marginBottom: 12 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { ...typography.title, color: colors.text, marginTop: 4 },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    marginTop: 6,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  footer: { width: "100%", marginTop: 14, alignItems: "center" },
  copyright: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 18,
  },
});

