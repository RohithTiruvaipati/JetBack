import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { RebookStackParamList } from "@/types/navigation";

type AvailableFlight = {
  id: string;
  flightNumber: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  fromCode: string;
  toCode: string;
  terminal: string;
  stopsLabel: string;
  priceUsd: number;
};

const CANCELLED_FLIGHT = {
  flightNumber: "AA 892",
  statusLabel: "CANCELLED",
  dateLabel: "",
  departTime: "2:15 PM",
  arriveTime: "6:30 PM",
  duration: "4h 15m",
  fromCode: "DFW",
  toCode: "LAX",
};

const AVAILABLE_FLIGHTS: AvailableFlight[] = [
  {
    id: "aa1245",
    flightNumber: "AA 1245",
    airline: "American",
    departTime: "2:30 PM",
    arriveTime: "6:45 PM",
    duration: "4h 15m",
    fromCode: "DFW",
    toCode: "LAX",
    terminal: "A12",
    stopsLabel: "Nonstop",
    priceUsd: 389,
  },
  {
    id: "dl2890",
    flightNumber: "DL 2890",
    airline: "Delta",
    departTime: "3:05 PM",
    arriveTime: "7:18 PM",
    duration: "4h 13m",
    fromCode: "DFW",
    toCode: "LAX",
    terminal: "B4",
    stopsLabel: "Nonstop",
    priceUsd: 425,
  },
  {
    id: "ua903",
    flightNumber: "UA 903",
    airline: "United",
    departTime: "4:10 PM",
    arriveTime: "8:35 PM",
    duration: "4h 25m",
    fromCode: "DFW",
    toCode: "LAX",
    terminal: "C17",
    stopsLabel: "1 stop",
    priceUsd: 349,
  },
];

const ORIGINAL_TICKET_USD = 328;

type Props = NativeStackScreenProps<RebookStackParamList, "RebookFlight">;

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

export function RebookFlightScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = React.useState(AVAILABLE_FLIGHTS[0]?.id ?? "");
  const today = React.useMemo(() => new Date(), []);
  const cancelledDateLabel = React.useMemo(() => formatDateLabel(today), [today]);
  const searchDateLabel = React.useMemo(() => formatDateLabel(addDays(today, 2)), [today]);

  const selected = React.useMemo(
    () => AVAILABLE_FLIGHTS.find((f) => f.id === selectedId) ?? AVAILABLE_FLIGHTS[0],
    [selectedId]
  );

  const fareDifferenceUsd = Math.max(0, (selected?.priceUsd ?? 0) - ORIGINAL_TICKET_USD);

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Ionicons name="airplane" size={16} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Rebook Flight</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CancelledCard dateLabel={cancelledDateLabel} />

        <View style={styles.searchCard}>
          <Text style={styles.sectionTitle}>Search New Flights</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchPill}>
              <Text style={styles.searchText}>{searchDateLabel}</Text>
            </View>
            <View style={styles.searchPill}>
              <Text style={styles.searchText}>DFW → LAX</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Flights</Text>
        <View style={styles.list}>
          {AVAILABLE_FLIGHTS.map((flight) => (
            <AvailableFlightCard
              key={flight.id}
              flight={flight}
              selected={flight.id === selectedId}
              onPress={() => setSelectedId(flight.id)}
            />
          ))}
        </View>

        <View style={styles.fareRow}>
          <View style={styles.payRow}>
            <Ionicons name="card-outline" size={18} color={colors.subtext} />
            <Text style={styles.payText}>VISA •••• 4242</Text>
          </View>
          <View style={styles.fareRight}>
            <Text style={styles.fareDiffLabel}>Fare Difference</Text>
            <Text style={styles.fareDiffValue}>${fareDifferenceUsd}</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("RebookConfirm", { selectedFlightId: selected?.id ?? "" })
          }
        >
          <Text style={styles.primaryButtonText}>Confirm Rebooking</Text>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable
            accessibilityRole="button"
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.secondaryButton}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function CancelledCard({ dateLabel }: { dateLabel: string }) {
  return (
    <View style={styles.cancelledCard}>
      <View style={styles.cancelledTop}>
        <Text style={styles.cancelledFlightNum}>{CANCELLED_FLIGHT.flightNumber}</Text>
        <Text style={styles.cancelledStatus}>{CANCELLED_FLIGHT.statusLabel}</Text>
      </View>
      <Text style={styles.cancelledDate}>{dateLabel}</Text>

      <View style={styles.routeRow}>
        <View style={styles.routeBlock}>
          <Text style={styles.routeTime}>{CANCELLED_FLIGHT.departTime}</Text>
          <Text style={styles.routeCode}>{CANCELLED_FLIGHT.fromCode}</Text>
        </View>

        <View style={styles.routeMid}>
          <View style={styles.routeLine} />
          <Ionicons name="airplane" size={14} color={colors.orange} />
          <View style={styles.routeLine} />
          <Text style={styles.routeDuration}>{CANCELLED_FLIGHT.duration}</Text>
        </View>

        <View style={[styles.routeBlock, { alignItems: "flex-end" }]}>
          <Text style={styles.routeTime}>{CANCELLED_FLIGHT.arriveTime}</Text>
          <Text style={styles.routeCode}>{CANCELLED_FLIGHT.toCode}</Text>
        </View>
      </View>
    </View>
  );
}

function AvailableFlightCard({
  flight,
  selected,
  onPress,
}: {
  flight: AvailableFlight;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.flightCard, selected && styles.flightCardSelected]}
    >
      <View style={styles.flightCardTop}>
        <View>
          <Text style={styles.flightNum}>{flight.flightNumber}</Text>
          <Text style={styles.flightAirline}>{flight.airline}</Text>
        </View>

        <View style={styles.flightRightTop}>
          <Text style={styles.flightPrice}>${flight.priceUsd}</Text>
          <View style={styles.stopsPill}>
            <Text style={styles.stopsText}>{flight.stopsLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.flightRow}>
        <View style={styles.flightCol}>
          <Text style={styles.flightTime}>{flight.departTime}</Text>
          <Text style={styles.flightSub}>{flight.fromCode}  {flight.terminal}</Text>
        </View>

        <View style={styles.flightMid}>
          <Ionicons name="time-outline" size={14} color={colors.subtext} />
          <Text style={styles.flightDuration}>{flight.duration}</Text>
        </View>

        <View style={[styles.flightCol, { alignItems: "flex-end" }]}>
          <Text style={styles.flightTime}>{flight.arriveTime}</Text>
          <Text style={styles.flightSub}>{flight.toCode}</Text>
        </View>
      </View>

      {selected && (
        <View style={styles.selectedDotWrap} accessibilityRole="image" aria-label="Selected">
          <View style={styles.selectedDot} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: "#00000008",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.h2, color: colors.text },
  container: { padding: 16, paddingBottom: 28 },

  cancelledCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.orange,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cancelledTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  cancelledFlightNum: { ...typography.caption, color: colors.subtext, fontWeight: "800" },
  cancelledStatus: { ...typography.caption, color: colors.subtext, fontWeight: "800" },
  cancelledDate: { ...typography.caption, color: colors.subtext, marginTop: 4 },

  routeRow: { marginTop: 10, flexDirection: "row", alignItems: "center" },
  routeBlock: { flex: 1 },
  routeTime: { ...typography.h2, color: colors.text, fontWeight: "800" },
  routeCode: { ...typography.caption, color: colors.subtext, marginTop: 2, fontWeight: "700" },
  routeMid: { width: 130, alignItems: "center", justifyContent: "center" },
  routeLine: { height: 1, width: "100%", backgroundColor: colors.divider },
  routeDuration: { ...typography.caption, color: colors.subtext, marginTop: 6 },

  searchCard: {
    marginTop: 12,
    backgroundColor: colors.grayPill,
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: { ...typography.caption, color: colors.subtext, fontWeight: "800" },
  searchRow: { marginTop: 10, flexDirection: "row", gap: 10 },
  searchPill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  searchText: { ...typography.body, color: colors.text, fontWeight: "700" },

  list: { marginTop: 10, gap: 10 },
  flightCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#00000008",
  },
  flightCardSelected: { borderColor: colors.orange, shadowColor: colors.shadow, shadowOpacity: 1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  flightCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  flightRightTop: { alignItems: "flex-end", gap: 6 },
  flightNum: { ...typography.caption, color: colors.text, fontWeight: "900" },
  flightAirline: { ...typography.caption, color: colors.subtext, marginTop: 2 },
  flightPrice: { ...typography.h2, color: colors.orange, fontWeight: "900" },
  stopsPill: { backgroundColor: colors.greenSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  stopsText: { ...typography.caption, color: colors.green, fontWeight: "800" },
  flightRow: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  flightCol: { flex: 1 },
  flightTime: { ...typography.h2, color: colors.text, fontWeight: "900" },
  flightSub: { ...typography.caption, color: colors.subtext, marginTop: 2, fontWeight: "700" },
  flightMid: { width: 90, alignItems: "center", gap: 4, flexDirection: "row", justifyContent: "center" },
  flightDuration: { ...typography.caption, color: colors.subtext, fontWeight: "700" },
  selectedDotWrap: { position: "absolute", left: 10, top: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orangeSoft, alignItems: "center", justifyContent: "center" },
  selectedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.orange },

  fareRow: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  payText: { ...typography.caption, color: colors.subtext, fontWeight: "700" },
  fareRight: { alignItems: "flex-end" },
  fareDiffLabel: { ...typography.caption, color: colors.subtext, fontWeight: "700" },
  fareDiffValue: { ...typography.h2, color: colors.green, fontWeight: "900" },

  primaryButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "900" as const, fontSize: 15 },

  bottomButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
  secondaryButton: {
    flex: 1,
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
