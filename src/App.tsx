import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { PhoneFrame } from "@/components/PhoneFrame";
import { colors } from "@/theme/colors";
import type {
  RootTabParamList,
  FlightsStackParamList,
  MessagesStackParamList,
  AuthStackParamList,
  AppRootStackParamList,
} from "@/types/navigation";

import { SavedFlightsScreen } from "@/screens/SavedFlightsScreen";
import { FlightStatusScreen } from "@/screens/FlightStatusScreen";
import { PassengerRightsScreen } from "@/screens/PassengerRightsScreen";
import { ChatListScreen } from "@/screens/ChatListScreen";
import { ChatConversationScreen } from "@/screens/ChatConversationScreen";
import { AgentEscalationScreen } from "@/screens/AgentEscalationScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { CreateAccountScreen } from "@/screens/CreateAccountScreen";
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen";

// ─── Nested stacks ──────────────────────────────────────────────────

const FlightsStack = createNativeStackNavigator<FlightsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppRootStack = createNativeStackNavigator<AppRootStackParamList>();

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

function AuthNavigator({ onSignedIn }: { onSignedIn: () => void }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <AuthStack.Screen name="Login">
        {(props) => <LoginScreen {...props} onSignedIn={onSignedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="CreateAccount">
        {(props) => <CreateAccountScreen {...props} onSignedIn={onSignedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
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

function TabIcon({ icon, focused, color }: { icon: any; focused: boolean; color: string }) {
  return (
    <View
      style={[
        tabStyles.iconWrap,
        focused && tabStyles.iconWrapActive,
      ]}
    >
      <Ionicons name={icon} size={22} color={color} />
    </View>
  );
}

export default function App() {
  const [signedIn, setSignedIn] = React.useState(false);

  return (
    <PhoneFrame>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <AppRootStack.Navigator screenOptions={{ headerShown: false }}>
          {!signedIn ? (
            <AppRootStack.Screen name="Auth">
              {() => <AuthNavigator onSignedIn={() => setSignedIn(true)} />}
            </AppRootStack.Screen>
          ) : (
            <AppRootStack.Screen name="Main">
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarStyle: tabStyles.bar,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: colors.card,
                    tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
                  }}
                >
                  <Tab.Screen
                    name="FlightsTab"
                    component={FlightsNavigator}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabIcon icon="airplane" focused={focused} color={color} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="MessagesTab"
                    component={MessagesNavigator}
                    options={{
                      tabBarIcon: ({ focused, color }) => (
                        <TabIcon icon="chatbubbles" focused={focused} color={color} />
                      ),
                    }}
                  />
                </Tab.Navigator>
              )}
            </AppRootStack.Screen>
          )}
        </AppRootStack.Navigator>
      </NavigationContainer>
    </PhoneFrame>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.orange,
    borderTopWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
    height: 60,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
