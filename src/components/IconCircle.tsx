import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export function IconCircle({ label }: { label: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="image" aria-label={label}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.grayPill,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text
  }
});

