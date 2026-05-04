import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { Pill } from "./Pill";
import type { SavedFlight } from "@/data/dummy";

function toneForStatus(status: SavedFlight["status"]): "danger" | "neutral" | "success" {
  if (status === "DELAYED") return "danger";
  if (status === "CANCELLED") return "danger";
  if (status === "ON_TIME") return "success";
  return "neutral";
}

export function FlightCard({
  flight,
  onPress,
  onLongPress,
  onRebookPress,
}: {
  flight: SavedFlight;
  onPress?: () => void;
  onLongPress?: () => void;
  onRebookPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Text style={styles.flightNum}>{flight.flightNumber}</Text>
        <View style={styles.topRight}>
          {flight.status !== "ON_TIME" && !!onRebookPress && (
            <Pressable
              onPress={(e) => {
                (e as any)?.stopPropagation?.();
                onRebookPress();
              }}
              accessibilityRole="button"
              style={styles.rebookChip}
            >
              <Text style={styles.rebookChipText}>Rebook</Text>
            </Pressable>
          )}
          <Pill text={flight.statusLabel} tone={toneForStatus(flight.status)} />
        </View>
      </View>

      <View style={styles.codesRow}>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>{flight.fromCode}</Text>
          <Text style={styles.city}>{flight.fromCity}</Text>
          <Text style={styles.time}>{flight.departTime}</Text>
        </View>

        <View style={styles.mid}>
          <Text style={styles.midText}>Today</Text>
        </View>

        <View style={[styles.codeBlock, { alignItems: "flex-end" }]}>
          <Text style={styles.code}>{flight.toCode}</Text>
          <Text style={styles.city}>{flight.toCity}</Text>
          <Text style={styles.time}>{flight.arriveTime}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Terminal {flight.terminal}</Text>
        <View style={styles.dot} />
        <Text style={styles.meta}>Gate {flight.gate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  flightNum: { ...typography.caption, color: colors.subtext, fontWeight: "700" },
  rebookChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.orangeSoft,
  },
  rebookChipText: { ...typography.caption, color: colors.orange, fontWeight: "900" },
  codesRow: { marginTop: 10, flexDirection: "row", alignItems: "center" },
  codeBlock: { flex: 1 },
  code: { fontSize: 28, fontWeight: "900", color: colors.text, letterSpacing: 0.5 },
  city: { ...typography.caption, color: colors.subtext, marginTop: 2 },
  time: { ...typography.body, color: colors.text, marginTop: 6, fontWeight: "700" },
  mid: { width: 60, alignItems: "center" },
  midText: { ...typography.caption, color: colors.subtext },
  metaRow: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  meta: { ...typography.caption, color: colors.subtext, fontWeight: "600" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.divider, marginHorizontal: 8 }
});
