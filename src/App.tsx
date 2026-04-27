import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { PhoneFrame } from "@/components/PhoneFrame";
import { colors } from "@/theme/colors";
import type { RootStackParamList } from "@/types/navigation";
import { SavedFlightsScreen } from "@/screens/SavedFlightsScreen";
import { FlightStatusScreen } from "@/screens/FlightStatusScreen";
import { PassengerRightsScreen } from "@/screens/PassengerRightsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg
  }
};

export default function App() {
  return (
    <PhoneFrame>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="SavedFlights" component={SavedFlightsScreen} />
          <Stack.Screen name="FlightStatus" component={FlightStatusScreen} />
          <Stack.Screen name="PassengerRights" component={PassengerRightsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneFrame>
  );
}

