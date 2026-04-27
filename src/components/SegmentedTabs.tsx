import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function SegmentedTabs({
  left,
  right,
  value,
  onChange
}: {
  left: string;
  right: string;
  value: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      <Pressable
        onPress={() => onChange("left")}
        style={[styles.tab, value === "left" && styles.tabActive]}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "left" }}
      >
        <Text style={[styles.text, value === "left" && styles.textActive]}>{left}</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("right")}
        style={[styles.tab, value === "right" && styles.tabActive]}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "right" }}
      >
        <Text style={[styles.text, value === "right" && styles.textActive]}>{right}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.divider
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  tabActive: {
    backgroundColor: colors.orange
  },
  text: { ...typography.body, color: colors.subtext, fontWeight: "700" },
  textActive: { color: "#FFFFFF" }
});

