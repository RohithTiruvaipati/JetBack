import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { RebookStackParamList } from "@/types/navigation";
import { useFlights } from "@/state/FlightsStore";

const FLIGHTS_BY_ID = {
  aa1245: {
    id: "aa1245",
    flightNumber: "AA 1245",
    airline: "American",
    fromCode: "DFW",
    toCode: "LAX",
    departTime: "2:30 PM",
    arriveTime: "6:45 PM",
    duration: "4h 15m",
    terminal: "A12",
    stopsLabel: "Nonstop",
    priceUsd: 389,
    dateLabel: "",
  },
  dl2890: {
    id: "dl2890",
    flightNumber: "DL 2890",
    airline: "Delta",
    fromCode: "DFW",
    toCode: "LAX",
    departTime: "3:05 PM",
    arriveTime: "7:18 PM",
    duration: "4h 13m",
    terminal: "B4",
    stopsLabel: "Nonstop",
    priceUsd: 425,
    dateLabel: "",
  },
  ua903: {
    id: "ua903",
    flightNumber: "UA 903",
    airline: "United",
    fromCode: "DFW",
    toCode: "LAX",
    departTime: "4:10 PM",
    arriveTime: "8:35 PM",
    duration: "4h 25m",
    terminal: "C17",
    stopsLabel: "1 stop",
    priceUsd: 349,
    dateLabel: "",
  },
} as const;

type Props = NativeStackScreenProps<RebookStackParamList, "RebookConfirm">;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function RebookConfirmScreen({ navigation, route }: Props) {
  const { getFlight, rebookFlight } = useFlights();

  const flight =
    (FLIGHTS_BY_ID as any)[route.params.selectedFlightId] ??
    FLIGHTS_BY_ID.aa1245;
  const dateLabel = React.useMemo(() => formatDateLabel(addDays(new Date(), 2)), []);
  const original = getFlight(route.params.originalFlightId);
  const originalFareUsd = original?.priceUsd ?? 0;
  const fareDifferenceUsd = Math.max(0, (flight?.priceUsd ?? 0) - originalFareUsd);

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Rebooking</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Flight</Text>
          <Text style={styles.cardSub}>{dateLabel}</Text>

          <View style={styles.routeRow}>
            <View style={styles.routeBlock}>
              <Text style={styles.routeTime}>{flight.departTime}</Text>
              <Text style={styles.routeCode}>{flight.fromCode}</Text>
              <Text style={styles.routeMeta}>Terminal {flight.terminal}</Text>
            </View>

            <View style={styles.routeMid}>
              <Ionicons name="time-outline" size={14} color={colors.subtext} />
              <Text style={styles.routeDuration}>{flight.duration}</Text>
              <Text style={styles.routeStops}>{flight.stopsLabel}</Text>
            </View>

            <View style={[styles.routeBlock, { alignItems: "flex-end" }]}>
              <Text style={styles.routeTime}>{flight.arriveTime}</Text>
              <Text style={styles.routeCode}>{flight.toCode}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Flight</Text>
            <Text style={styles.rowValue}>
              {flight.flightNumber} • {flight.airline}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Original fare</Text>
            <Text style={styles.rowValue}>${originalFareUsd}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>New fare</Text>
            <Text style={styles.rowValue}>${flight.priceUsd}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Payment</Text>
            <Text style={styles.rowValue}>VISA •••• 4242</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Fare difference</Text>
            <Text style={styles.totalValue}>${fareDifferenceUsd}</Text>
          </View>
          <Text style={styles.chargeNote}>
            Your card will be charged the fare difference today.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          accessibilityRole="button"
          onPress={() => {
            rebookFlight(route.params.originalFlightId, {
              airline: flight.airline,
              flightNumber: flight.flightNumber,
              departTime: flight.departTime,
              arriveTime: flight.arriveTime,
              terminal: flight.terminal,
              status: "ON_TIME",
              statusLabel: "Rebooked",
              priceUsd: flight.priceUsd,
            });
            (navigation as any).navigate("FlightsTab", { screen: "SavedFlights" });
          }}
        >
          <Text style={styles.primaryButtonText}>Complete Rebooking</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          accessibilityRole="button"
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: "#00000008",
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.grayPill,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.h2, color: colors.text },
  container: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTitle: { ...typography.h2, color: colors.text },
  cardSub: { ...typography.caption, color: colors.subtext, marginTop: 4 },
  routeRow: { marginTop: 14, flexDirection: "row", alignItems: "center" },
  routeBlock: { flex: 1 },
  routeTime: { ...typography.h2, color: colors.text, fontWeight: "900" },
  routeCode: { ...typography.caption, color: colors.subtext, marginTop: 2, fontWeight: "800" },
  routeMeta: { ...typography.caption, color: colors.subtext, marginTop: 4 },
  routeMid: { width: 120, alignItems: "center", gap: 6 },
  routeDuration: { ...typography.caption, color: colors.subtext, fontWeight: "800" },
  routeStops: { ...typography.caption, color: colors.green, fontWeight: "900" },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  rowLabel: { ...typography.caption, color: colors.subtext, fontWeight: "800" },
  rowValue: { ...typography.caption, color: colors.text, fontWeight: "800" },
  totalValue: { ...typography.h2, color: colors.orange, fontWeight: "900" },
  chargeNote: { ...typography.caption, color: colors.subtext, marginTop: 10 },
  primaryButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "900" as const, fontSize: 15 },
  secondaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { ...typography.body, color: colors.subtext, fontWeight: "800" },
});
