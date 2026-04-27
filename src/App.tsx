import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { PhoneFrame } from "@/components/PhoneFrame";
import { colors } from "@/theme/colors";
import type {
  RootTabParamList,
  FlightsStackParamList,
  MessagesStackParamList,
} from "@/types/navigation";

import { SavedFlightsScreen } from "@/screens/SavedFlightsScreen";
import { FlightStatusScreen } from "@/screens/FlightStatusScreen";
import { PassengerRightsScreen } from "@/screens/PassengerRightsScreen";
import { ChatListScreen } from "@/screens/ChatListScreen";
import { ChatConversationScreen } from "@/screens/ChatConversationScreen";
import { AgentEscalationScreen } from "@/screens/AgentEscalationScreen";

// ─── Nested stacks ──────────────────────────────────────────────────

const FlightsStack = createNativeStackNavigator<FlightsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();

function FlightsNavigator() {
  return (
    <FlightsStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <FlightsStack.Screen name="SavedFlights" component={SavedFlightsScreen} />
      <FlightsStack.Screen name="FlightStatus" component={FlightStatusScreen} />
      <FlightsStack.Screen name="PassengerRights" component={PassengerRightsScreen} />
    </FlightsStack.Navigator>
  );
}

function MessagesNavigator() {
  return (
    <MessagesStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <MessagesStack.Screen name="ChatList" component={ChatListScreen} />
      <MessagesStack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <MessagesStack.Screen name="AgentEscalation" component={AgentEscalationScreen} />
    </MessagesStack.Navigator>
  );
}

// ─── Tab bar ────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
  },
};

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View
      style={[
        tabStyles.iconWrap,
        focused && tabStyles.iconWrapActive,
      ]}
    >
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>
        {icon}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <PhoneFrame>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: tabStyles.bar,
            tabBarActiveTintColor: colors.orange,
            tabBarInactiveTintColor: colors.subtext,
            tabBarLabelStyle: tabStyles.label,
          }}
        >
          <Tab.Screen
            name="FlightsTab"
            component={FlightsNavigator}
            options={{
              tabBarLabel: "Flights",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="✈" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="MessagesTab"
            component={MessagesNavigator}
            options={{
              tabBarLabel: "Messages",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="💬" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PhoneFrame>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 6,
    paddingBottom: 6,
    height: 56,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.orangeSoft,
  },
  icon: {
    fontSize: 18,
  },
  iconActive: {},
});
