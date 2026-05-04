import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { TopBar } from "@/components/TopBar";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { Timeline } from "@/components/Timeline";
import { flightTimelineAA2047 } from "@/data/dummy";
import { useFlights } from "@/state/FlightsStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FlightsStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<FlightsStackParamList, "FlightStatus">;

export function FlightStatusScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<"left" | "right">("left");
  const { flights } = useFlights();
  const flight = useMemo(
    () => flights.find((f) => f.id === route.params.flightId) ?? flights[0],
    [route.params.flightId, flights]
  );

  const showRebook = flight.status !== "ON_TIME";

  return (
    <View style={styles.container}>
      <TopBar
        title="Flight Status"
        subtitle="DFW AIRPORT • FLIGHT STATUS"
        rightIcon="🔔"
        leftChevron
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.flightHeader}>
          <Text style={styles.flightNum}>{flight.flightNumber.replace(" ", "")}</Text>
          <Text style={styles.dateText}>Mar 6, 2026</Text>
        </View>

        <View style={styles.codesRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.code}>DFW</Text>
            <Text style={styles.city}>Dallas/Fort Worth</Text>
            <Text style={styles.time}>{flight.departTime}</Text>
          </View>
          <View style={styles.mid}>
            <Text style={styles.midTop}>6h 15m • Nonstop</Text>
            <View style={styles.planeChip}>
              <Text style={styles.planeChipText}>✈</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.code}>LAX</Text>
            <Text style={styles.city}>Los Angeles</Text>
            <Text style={styles.time}>{flight.arriveTime}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Meta label="TERMINAL" value={`Terminal ${flight.terminal}`} />
          <Meta label="GATE" value={flight.gate} />
          <Meta label="AIRLINE" value={flight.airline} />
          <Meta label="AIRCRAFT" value={flight.aircraft} />
        </View>

        <View style={{ marginTop: 14 }}>
          <SegmentedTabs left="Status" right="Support" value={tab} onChange={setTab} />
        </View>

        {tab === "left" ? (
          <View style={{ marginTop: 16 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Flight Timeline</Text>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Timeline items={flightTimelineAA2047} />
            </View>

            <View style={{ height: 12 }} />
            <Pressable
              style={styles.liveUpdates}
              accessibilityRole="button"
              onPress={() => {}}
            >
              <Text style={styles.liveUpdatesText}>Live Updates</Text>
              <Text style={styles.chevSmall}>›</Text>
            </Pressable>

            {showRebook && (
              <>
                <View style={{ height: 12 }} />
                <Pressable
                  style={styles.rebookBtn}
                  accessibilityRole="button"
                  onPress={() => {
                    (navigation as any).navigate("RebookTab", {
                      screen: "RebookFlight",
                      params: { originalFlightId: flight.id },
                    });
                  }}
                >
                  <Text style={styles.rebookText}>Rebook flight</Text>
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <View style={{ marginTop: 16, gap: 12 }}>
            <Pressable
              style={styles.supportCard}
              accessibilityRole="button"
              onPress={() => navigation.navigate("PassengerRights")}
            >
              <Text style={styles.supportTitle}>Passenger Rights</Text>
              <Text style={styles.supportSub}>Refunds, compensation, baggage, DOT rules</Text>
              <Text style={styles.supportLink}>Open</Text>
            </Pressable>

            <Pressable
              style={styles.supportCard}
              accessibilityRole="button"
              onPress={() => {
                (navigation as any).navigate("MessagesTab", {
                  screen: "ChatConversation",
                  params: { conversationId: "conv-bot-today" },
                });
              }}
            >
              <Text style={styles.supportTitle}>Quick Support</Text>
              <Text style={styles.supportSub}>Chat with jetBack Assistant or a live agent</Text>
              <Text style={styles.supportLink}>Open Chat</Text>
            </Pressable>

            <Pressable
              style={styles.supportCard}
              accessibilityRole="button"
              onPress={() => {
                (navigation as any).navigate("MessagesTab", {
                  screen: "ChatList",
                });
              }}
            >
              <Text style={styles.supportTitle}>All Messages</Text>
              <Text style={styles.supportSub}>View all conversations and support history</Text>
              <Text style={styles.supportLink}>View</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 16 },

  flightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6
  },
  flightNum: { fontSize: 22, fontWeight: "900", color: colors.text, letterSpacing: 1 },
  dateText: { ...typography.caption, color: colors.subtext, fontWeight: "600" },

  codesRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.divider
  },
  code: { fontSize: 32, fontWeight: "900", color: colors.text },
  city: { ...typography.caption, color: colors.subtext, marginTop: 2 },
  time: { ...typography.body, color: colors.text, marginTop: 6, fontWeight: "800" },
  mid: { width: 110, alignItems: "center", gap: 8 },
  midTop: { ...typography.caption, color: colors.subtext, textAlign: "center" },
  planeChip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center"
  },
  planeChipText: { color: "#fff", fontWeight: "900" },

  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  metaItem: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.divider
  },
  metaLabel: { fontSize: 10, color: colors.subtext, fontWeight: "800", letterSpacing: 0.5 },
  metaValue: { ...typography.caption, color: colors.text, fontWeight: "700", marginTop: 4 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { ...typography.h2, color: colors.text },
  liveChip: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.orange },
  liveText: { ...typography.caption, color: colors.subtext, fontWeight: "700" },

  card: {
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.divider
  },

  liveUpdates: {
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  liveUpdatesText: { ...typography.body, color: colors.text, fontWeight: "800" },
  chevSmall: { fontSize: 18, color: colors.subtext, fontWeight: "900" },
  rebookBtn: {
    backgroundColor: colors.orange,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center"
  },
  rebookText: { color: "#fff", fontWeight: "900" },

  supportCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.divider
  },
  supportTitle: { ...typography.h2, color: colors.text },
  supportSub: { ...typography.caption, color: colors.subtext, marginTop: 6 },
  supportLink: { ...typography.caption, color: colors.orange, fontWeight: "800", marginTop: 10 }
});
