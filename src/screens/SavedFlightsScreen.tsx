import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";
import { TopBar } from "@/components/TopBar";
import { FlightCard } from "@/components/FlightCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FlightsStackParamList } from "@/types/navigation";
import { useFlights } from "@/state/FlightsStore";

type Props = NativeStackScreenProps<FlightsStackParamList, "SavedFlights">;

export function SavedFlightsScreen({ navigation }: Props) {
  const { flights } = useFlights();

  return (
    <View style={styles.container}>
      <TopBar
        title="Saved Flights"
        subtitle={`DFW Airport • ${flights.length} saved flights`}
        rightIcon="+"
        onRightPress={() => {
          const first = flights[0];
          navigation.navigate("FlightStatus", { flightId: first.id });
        }}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={flights}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => (
          <FlightCard
            flight={item}
            onPress={() => navigation.navigate("FlightStatus", { flightId: item.id })}
            onRebookPress={() => {
              (navigation as any).navigate("RebookTab", {
                screen: "RebookFlight",
                params: { originalFlightId: item.id },
              });
            }}
            onLongPress={() => {
              (navigation as any).navigate("RebookTab", {
                screen: "RebookFlight",
                params: { originalFlightId: item.id },
              });
            }}
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
