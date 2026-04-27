import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export function Pill({
  text,
  tone
}: {
  text: string;
  tone: "danger" | "neutral" | "success";
}) {
  const toneStyle =
    tone === "danger"
      ? { backgroundColor: colors.orangeSoft, color: colors.orange }
      : tone === "success"
        ? { backgroundColor: colors.greenSoft, color: colors.green }
        : { backgroundColor: colors.grayPill, color: colors.subtext };

  return (
    <View style={[styles.wrap, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text style={[styles.text, { color: toneStyle.color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  text: {
    fontSize: 12,
    fontWeight: "700"
  }
});

