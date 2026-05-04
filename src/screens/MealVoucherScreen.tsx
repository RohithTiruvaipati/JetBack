import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { TopBar } from "@/components/TopBar";
import { Ionicons } from "@expo/vector-icons";

const restaurants = [
  { id: "1", name: "Sky Burger Bar", terminal: "Terminal A", price: "$$", time: "10-15 min", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" },
  { id: "2", name: "Tokyo Express", terminal: "Terminal B", price: "$$$", time: "15-20 min", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop" },
  { id: "3", name: "Gate Pizza Co.", terminal: "Terminal A", price: "$$", time: "12-18 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" },
  { id: "4", name: "Terminal Café", terminal: "Terminal C", price: "$", time: "5-10 min", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&auto=format&fit=crop" },
  { id: "5", name: "Tex-Mex Cantina", terminal: "Terminal B", price: "$$", time: "10-15 min", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200&auto=format&fit=crop" },
];

// Generate a stable voucher code
const VOUCHER_CODE = "MVR-" + Math.random().toString(36).slice(2, 8).toUpperCase();

export function MealVoucherScreen({ navigation }: any) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState(false);

  const restaurant = restaurants.find((r) => r.id === selectedRestaurant);

  // ─── Confirmation screen ─────────────────────────────────────────
  if (redeemed && restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <TopBar title="Meal Voucher Redemption" />
        <View style={styles.confirmWrapper}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>
          <Text style={styles.confirmTitle}>Voucher Redeemed!</Text>
          <Text style={styles.confirmSub}>Show this screen at the restaurant.</Text>

          {/* QR-style code card */}
          <View style={styles.codeCard}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeLabel}>Redemption Code</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.code}>{VOUCHER_CODE}</Text>
            <View style={styles.codeDivider} />
            <View style={styles.codeDetails}>
              <View style={styles.codeDetailRow}>
                <Ionicons name="restaurant-outline" size={14} color={colors.subtext} />
                <Text style={styles.codeDetailText}>{restaurant.name}</Text>
              </View>
              <View style={styles.codeDetailRow}>
                <Ionicons name="location-outline" size={14} color={colors.subtext} />
                <Text style={styles.codeDetailText}>{restaurant.terminal}</Text>
              </View>
              <View style={styles.codeDetailRow}>
                <Ionicons name="card-outline" size={14} color={colors.subtext} />
                <Text style={styles.codeDetailText}>Credit: $20.00</Text>
              </View>
              <View style={styles.codeDetailRow}>
                <Ionicons name="time-outline" size={14} color={colors.subtext} />
                <Text style={styles.codeDetailText}>Expires 11:45 PM</Text>
              </View>
            </View>
          </View>

          <Text style={styles.confirmNote}>
            Present this code to the cashier. Any amount over $20.00 will be charged to your card on file.
          </Text>

          <Pressable style={styles.doneBtn} onPress={() => setRedeemed(false)}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Selection screen ────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <TopBar
        title="Meal Voucher Redemption"
        leftChevron
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.creditCard}>
          <View style={styles.creditHeader}>
            <Text style={styles.creditTitle}>Meal Credit</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.amount}>$20.00</Text>
          <View style={styles.creditFooter}>
            <Ionicons name="time-outline" size={14} color={colors.subtext} />
            <Text style={styles.expireText}>Expires 11:45 PM</Text>
            <Text style={styles.dividerText}>|</Text>
            <Text style={styles.expireText}>Flight delay - 3 hours</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Restaurants</Text>

        <View style={styles.list}>
          {restaurants.map((r) => {
            const isSelected = selectedRestaurant === r.id;
            return (
              <Pressable key={r.id} style={styles.restaurantCard} onPress={() => setSelectedRestaurant(r.id)}>
                <Image source={{ uri: r.img }} style={styles.restaurantImg} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{r.name}</Text>
                  <View style={styles.locRow}>
                    <Ionicons name="location-outline" size={12} color={colors.orange} />
                    <Text style={styles.locText}>{r.terminal}</Text>
                  </View>
                  <Text style={styles.detailsText}>{r.price} • {r.time}</Text>
                </View>
                <View style={[styles.selectBtn, isSelected && styles.selectBtnActive]}>
                  <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
                    {isSelected ? "Selected" : "Select"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.primaryBtn, selectedRestaurant ? styles.primaryBtnActive : {}]}
          disabled={!selectedRestaurant}
          onPress={() => setRedeemed(true)}
        >
          <Text style={styles.primaryBtnText}>Redeem Voucher</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
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
  confirmTitle: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 6 },
  confirmSub: { fontSize: 14, color: colors.subtext, marginBottom: 28 },
  codeCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 20,
    alignItems: "center",
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  codeLabel: { fontSize: 13, color: colors.subtext },
  code: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 4,
    marginBottom: 16,
  },
  codeDivider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 16,
  },
  codeDetails: { width: "100%", gap: 8 },
  codeDetailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  codeDetailText: { fontSize: 13, color: colors.subtext },
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

  // ── Selection ──
  creditCard: {
    backgroundColor: "#EBEBEB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  creditHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  creditTitle: { ...typography.h2, color: colors.text },
  activeBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: { color: colors.orange, fontSize: 12, fontWeight: "700" },
  amount: { fontSize: 28, fontWeight: "900", color: colors.orange, marginVertical: 12 },
  creditFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  expireText: { fontSize: 12, color: colors.subtext },
  dividerText: { color: "#ccc", fontSize: 12 },
  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: 12 },
  list: { gap: 12 },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  restaurantImg: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#ccc" },
  restaurantInfo: { flex: 1, marginLeft: 12 },
  restaurantName: { ...typography.body, fontWeight: "700", color: colors.text, marginBottom: 4 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  locText: { fontSize: 12, color: colors.subtext },
  detailsText: { fontSize: 12, color: colors.subtext },
  selectBtn: {
    backgroundColor: colors.grayPill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  selectBtnActive: { backgroundColor: "#4B5563" },
  selectBtnText: { fontSize: 14, fontWeight: "600", color: colors.text },
  selectBtnTextActive: { color: "#fff" },
  bottomBar: { padding: 16, paddingBottom: 24, backgroundColor: colors.card },
  primaryBtn: {
    backgroundColor: "#FF9B71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnActive: { backgroundColor: colors.orange },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#EBEBEB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: colors.text, fontSize: 16, fontWeight: "700" },
});
