import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TopBar } from "@/components/TopBar";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { passengerRights } from "@/data/dummy";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "PassengerRights">;

export function PassengerRightsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TopBar title="Passenger Rights" leftChevron onLeftPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Federal regulations and airline commitments that protect you at DFW and on every U.S.
          flight.
        </Text>

        <View style={styles.knowCard}>
          <Text style={styles.knowTitle}>Know your rights.</Text>
          <Text style={styles.knowText}>
            Airlines are required by law to honor these protections. If a carrier refuses, file a
            complaint with the DOT at airconsumer.dot.gov.
          </Text>
        </View>

        <View style={{ height: 10 }} />
        {passengerRights.map((it) => (
          <Pressable key={it.id} style={styles.item} accessibilityRole="button" onPress={() => {}}>
            <View style={styles.iconStub} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{it.title}</Text>
              <Text style={styles.itemSub}>{it.subtitle}</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))}

        <Text style={styles.footer}>
          Information current as of March 2026. Rules subject to change. Always verify with the
          DOT or your airline.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 18 },
  description: { ...typography.caption, color: colors.subtext, lineHeight: 16 },
  knowCard: {
    marginTop: 12,
    backgroundColor: colors.orangeSoft,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFD2BF"
  },
  knowTitle: { ...typography.body, color: colors.orange, fontWeight: "900" },
  knowText: { ...typography.caption, color: colors.subtext, marginTop: 8, lineHeight: 16 },
  item: {
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconStub: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.grayPill
  },
  itemTitle: { ...typography.body, color: colors.text, fontWeight: "900" },
  itemSub: { ...typography.caption, color: colors.subtext, marginTop: 4 },
  chev: { fontSize: 18, color: colors.subtext, fontWeight: "900" },
  footer: { marginTop: 14, ...typography.caption, color: colors.subtext, textAlign: "center" }
});

