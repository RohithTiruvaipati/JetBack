import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { TimelineItem } from "@/data/dummy";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <View style={styles.wrap}>
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        const dotColor =
          it.state === "done" ? colors.green : it.state === "active" ? colors.orange : colors.divider;
        const textColor = it.state === "upcoming" ? colors.subtext : colors.text;

        return (
          <View key={it.id} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              {!isLast && <View style={styles.line} />}
            </View>
            <View style={styles.right}>
              <Text style={[styles.label, { color: textColor }]}>{it.label}</Text>
              {!!it.time && <Text style={styles.time}>{it.time}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: "row" },
  left: { width: 18, alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  line: { flex: 1, width: 2, backgroundColor: colors.divider, marginTop: 4 },
  right: { flex: 1, paddingBottom: 2 },
  label: { ...typography.body, fontWeight: "700" },
  time: { ...typography.caption, color: colors.subtext, marginTop: 3 }
});

