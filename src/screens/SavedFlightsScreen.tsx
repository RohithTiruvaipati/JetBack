import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";
import { savedFlights } from "@/data/dummy";
import { TopBar } from "@/components/TopBar";
import { FlightCard } from "@/components/FlightCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FlightsStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<FlightsStackParamList, "SavedFlights">;

export function SavedFlightsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TopBar
        title="Saved Flights"
        subtitle={`DFW Airport • ${savedFlights.length} saved flights`}
        rightIcon="+"
        onRightPress={() => {
          const first = savedFlights[0];
          navigation.navigate("FlightStatus", { flightId: first.id });
        }}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={savedFlights}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => (
          <FlightCard
            flight={item}
            onPress={() => navigation.navigate("FlightStatus", { flightId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingBottom: 16 }
});

