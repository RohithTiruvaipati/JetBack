import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { TopBar } from "@/components/TopBar";
import { Ionicons } from "@expo/vector-icons";

// Mock data
const restaurants = [
  { id: "1", name: "Sky Burger Bar", terminal: "Terminal A", price: "$$", time: "10-15 min", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" },
  { id: "2", name: "Tokyo Express", terminal: "Terminal B", price: "$$$", time: "15-20 min", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop" },
  { id: "3", name: "Gate Pizza Co.", terminal: "Terminal A", price: "$$", time: "12-18 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" },
  { id: "4", name: "Terminal Café", terminal: "Terminal C", price: "$", time: "5-10 min", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&auto=format&fit=crop" },
  { id: "5", name: "Tex-Mex Cantina", terminal: "Terminal B", price: "$$", time: "10-15 min", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200&auto=format&fit=crop" },
];

export function MealVoucherScreen({ navigation }: any) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

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
            <Text style={styles.divider}>|</Text>
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
          style={[styles.primaryBtn, selectedRestaurant && styles.primaryBtnActive]}
          disabled={!selectedRestaurant}
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
  creditCard: {
    backgroundColor: "#EBEBEB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  creditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  creditTitle: {
    ...typography.h2,
    color: colors.text,
  },
  activeBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "700",
  },
  amount: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.orange,
    marginVertical: 12,
  },
  creditFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  expireText: {
    fontSize: 12,
    color: colors.subtext,
  },
  divider: {
    color: "#ccc",
    fontSize: 12,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  restaurantImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    ...typography.body,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  locText: {
    fontSize: 12,
    color: colors.subtext,
  },
  detailsText: {
    fontSize: 12,
    color: colors.subtext,
  },
  selectBtn: {
    backgroundColor: colors.grayPill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  selectBtnActive: {
    backgroundColor: "#4B5563",
  },
  selectBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  selectBtnTextActive: {
    color: "#fff",
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.card,
  },
  primaryBtn: {
    backgroundColor: "#FF9B71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnActive: {
    backgroundColor: colors.orange,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "#EBEBEB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
