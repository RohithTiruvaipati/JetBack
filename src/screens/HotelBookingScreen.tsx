import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { TopBar } from "@/components/TopBar";
import { Ionicons } from "@expo/vector-icons";

const hotels = [
  { id: "1", name: "Grand Hyatt DFW", stars: 4, distance: "0.3 mi from DFW", price: "$189", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop" },
  { id: "2", name: "Marriott DFW Airport South", stars: 3, distance: "1.2 mi from DFW", price: "$159", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=200&auto=format&fit=crop" },
];

export function HotelBookingScreen({ navigation }: any) {
  const [selectedHotel, setSelectedHotel] = useState("1");
  const [confirmed, setConfirmed] = useState(false);

  const hotel = hotels.find((h) => h.id === selectedHotel)!;

  // ─── Confirmation screen ─────────────────────────────────────────
  if (confirmed) {
    return (
      <View style={styles.container}>
        <TopBar title="Hotel Booking" />
        <View style={styles.confirmWrapper}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>
          <Text style={styles.confirmTitle}>Booking Confirmed!</Text>
          <Text style={styles.confirmSub}>Your hotel has been reserved.</Text>

          <View style={styles.confirmCard}>
            <Row label="Hotel" value={hotel.name} />
            <Row label="Check-in" value="Mar 6, 2026" />
            <Row label="Check-out" value="Mar 7, 2026" />
            <Row label="Guests" value="2 Adults" />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>{hotel.price}.00</Text>
            </View>
            <View style={styles.confirmationRow}>
              <Text style={styles.confirmationLabel}>Confirmation #</Text>
              <Text style={styles.confirmationCode}>HTL-{Math.floor(100000 + Math.random() * 900000)}</Text>
            </View>
          </View>

          <Text style={styles.confirmNote}>
            A confirmation email has been sent to you. Check-in details will be available at the hotel front desk.
          </Text>

          <Pressable style={styles.doneBtn} onPress={() => setConfirmed(false)}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Booking screen ──────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <TopBar
        title="Hotel Booking"
        leftChevron
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Information</Text>
          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.label}>Flight</Text>
              <Text style={styles.value}>AA 2847</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: colors.orange }]}>Delayed 3hrs</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Passengers</Text>
              <Text style={styles.value}>2 Adults</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.value}>Mar 6, 2026</Text>
            </View>
          </View>
        </View>

        <Text style={styles.subhead}>Hotel Options</Text>

        <View style={styles.list}>
          {hotels.map((h) => {
            const isSelected = selectedHotel === h.id;
            return (
              <Pressable key={h.id} style={styles.hotelCard} onPress={() => setSelectedHotel(h.id)}>
                <Image source={{ uri: h.img }} style={styles.hotelImg} />
                <View style={styles.hotelInfo}>
                  <View style={styles.hotelHeaderRow}>
                    <Text style={styles.hotelName} numberOfLines={1}>{h.name}</Text>
                    <View style={styles.starsRow}>
                      {Array.from({ length: h.stars }).map((_, i) => (
                        <Ionicons key={i} name="star" size={10} color="#FBBF24" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.distanceText}>{h.distance}</Text>
                  <View style={styles.amenitiesRow}>
                    <Ionicons name="wifi" size={14} color={colors.subtext} />
                    <Ionicons name="bus" size={14} color={colors.subtext} />
                    <Ionicons name="cafe" size={14} color={colors.subtext} />
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{h.price}<Text style={styles.nightText}>/night</Text></Text>
                    <View style={[styles.selectBtn, isSelected ? styles.selectBtnActive : {}]}>
                      <Text style={[styles.selectBtnText, isSelected ? styles.selectBtnTextActive : {}]}>
                        {isSelected ? "Selected" : "Select"}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <Row label="Hotel" value={hotel.name} />
          <Row label="Check-in" value="Mar 6, 2026" />
          <Row label="Check-out" value="Mar 7, 2026" />
          <Row label="Guests" value="2 Adults" />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>{hotel.price}.00</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn} onPress={() => setConfirmed(true)}>
          <Text style={styles.primaryBtnText}>Confirm Hotel Booking</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 24 },

  // ── Confirmation ──
  confirmWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  successIcon: { marginBottom: 16 },
  confirmTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  confirmSub: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 28,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 20,
  },
  confirmationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  confirmationLabel: { fontSize: 13, color: colors.subtext },
  confirmationCode: { fontSize: 13, fontWeight: "700", color: colors.orange },
  confirmNote: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 12,
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // ── Booking form ──
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 16 },
  col: { width: "50%" },
  label: { fontSize: 12, color: colors.subtext, marginBottom: 4 },
  value: { ...typography.body, fontWeight: "600", color: colors.text },
  subhead: { ...typography.h2, color: colors.text, marginTop: 24, marginBottom: 12, marginLeft: 4 },
  list: { gap: 12 },
  hotelCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  hotelImg: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#ccc" },
  hotelInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  hotelHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hotelName: { ...typography.body, fontWeight: "700", color: colors.text, flex: 1, marginRight: 8 },
  starsRow: { flexDirection: "row", gap: 2 },
  distanceText: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  amenitiesRow: { flexDirection: "row", gap: 8, marginVertical: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceText: { fontSize: 16, fontWeight: "800", color: colors.orange },
  nightText: { fontSize: 12, fontWeight: "500", color: colors.text },
  selectBtn: { backgroundColor: colors.orange, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  selectBtnActive: { backgroundColor: "#4B5563" },
  selectBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  selectBtnTextActive: { color: "#fff" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: colors.subtext },
  summaryValue: { fontSize: 14, fontWeight: "500", color: colors.text },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: colors.text },
  totalValue: { fontSize: 18, fontWeight: "800", color: colors.orange },
  bottomBar: { padding: 16, paddingBottom: 24, backgroundColor: colors.bg },
  primaryBtn: {
    backgroundColor: colors.orange,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.text,
  },
  secondaryBtnText: { color: colors.text, fontSize: 16, fontWeight: "700" },
});
