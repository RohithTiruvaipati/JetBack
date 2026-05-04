import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { systemLog } from "@/data/chatData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MessagesStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<MessagesStackParamList, "AgentEscalation">;

type EscalationState = "connecting" | "connected" | "cancelled";

export function AgentEscalationScreen({ navigation, route }: Props) {
  const [state, setState] = useState<EscalationState>("connecting");
  const [waitTime, setWaitTime] = useState(120); // seconds
  const [waitMessage, setWaitMessage] = useState("");

  // Animated dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Pulse animation for the connecting card
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    systemLog(
      "info",
      "escalation_started",
      "User waiting for agent",
      route.params.conversationId
    );

    // Dots animation
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

    animateDot(dot1, 0).start();
    animateDot(dot2, 200).start();
    animateDot(dot3, 400).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Count down wait time
    const timer = setInterval(() => {
      setWaitTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setState("connected");
          systemLog(
            "info",
            "agent_connected",
            "Agent Sarah connected",
            route.params.conversationId
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate faster connection for demo
    const fastConnect = setTimeout(() => {
      setState("connected");
      setWaitTime(0);
      systemLog(
        "info",
        "agent_connected",
        "Agent Sarah connected (demo fast)",
        route.params.conversationId
      );
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(fastConnect);
    };
  }, []);

  const formatWait = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} minute${m !== 1 ? "s" : ""}${s > 0 ? ` ${s}s` : ""}`;
  };

  const handleCancel = useCallback(() => {
    setState("cancelled");
    systemLog(
      "info",
      "escalation_cancelled",
      "User cancelled agent request",
      route.params.conversationId
    );
    setTimeout(() => navigation.goBack(), 300);
  }, [navigation, route.params.conversationId]);

  const handleViewFlightDetails = useCallback(() => {
    systemLog(
      "info",
      "view_flight_from_escalation",
      "User tapped View flight details",
      route.params.conversationId
    );
    // Navigate cross-tab to the Flights tab
    (navigation as any).navigate("FlightsTab", {
      screen: "FlightStatus",
      params: { flightId: "aa2047" },
    });
  }, [navigation, route.params.conversationId]);

  const handleBrowseResources = useCallback(() => {
    systemLog(
      "info",
      "browse_delay_resources",
      "User tapped Browse delay resources",
      route.params.conversationId
    );
    (navigation as any).navigate("FlightsTab", {
      screen: "PassengerRights",
    });
  }, [navigation, route.params.conversationId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Ionicons name="headset" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>JetBack Support</Text>
            <Text style={styles.headerSubtitle}>
              Connecting you to a live agent
            </Text>
          </View>
        </View>

        <View style={styles.connectingBadge}>
          <View style={styles.connectingDotSmall} />
          <Text style={styles.connectingBadgeText}>
            {state === "connected" ? "Connected" : "Connecting..."}
          </Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {state !== "connected" ? (
          <Animated.View
            style={[styles.connectingCard, { transform: [{ scale: pulse }] }]}
          >
            {/* Animated dots */}
            <View style={styles.dotsRow}>
              {[dot1, dot2, dot3].map((dot, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.bigDot,
                    {
                      opacity: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.connectingTitle}>
              We're finding the next available{"\n"}support agent for you.
            </Text>

            <View style={styles.waitRow}>
              <Text style={styles.waitLabel}>Estimated wait time: </Text>
              <Text style={styles.waitValue}>{formatWait(waitTime)}</Text>
            </View>

            <Text style={styles.waitSub}>
              Please keep this chat open while we connect{"\n"}you.
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.connectedCard}>
            <View style={styles.connectedIcon}>
              <Text style={styles.connectedCheck}>✓</Text>
            </View>
            <Text style={styles.connectedTitle}>Connected!</Text>
            <Text style={styles.connectedSub}>
              Agent Sarah is now assisting you.
            </Text>
          </View>
        )}

        {state !== "connected" && (
          <View style={styles.agentPreview}>
            <View style={styles.agentAvatarLarge}>
              <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.agentPreviewLabel}>Next Available Agent</Text>
              <Text style={styles.agentPreviewName}>
                Agent Sarah (Connecting...)
              </Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionsWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleViewFlightDetails}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnText}>View flight details</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleBrowseResources}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnText}>Browse delay resources</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleCancel}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnText}>
              Cancel request
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Message while waiting */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="You can leave a message while waiting..."
          placeholderTextColor={colors.subtext}
          value={waitMessage}
          onChangeText={setWaitMessage}
          accessibilityLabel="Leave a message while waiting"
        />
        <Pressable
          style={[styles.sendBtn, !waitMessage.trim() && styles.sendBtnDisabled]}
          disabled={!waitMessage.trim()}
          onPress={() => {
            if (waitMessage.trim()) {
              systemLog(
                "info",
                "waiting_message_sent",
                waitMessage.trim(),
                route.params.conversationId
              );
              setWaitMessage("");
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.h2, color: "#4B5563", fontWeight: "700", fontSize: 20 },
  headerSubtitle: { ...typography.caption, color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  connectingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  connectingDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FBBF24",
  },
  connectingBadgeText: { ...typography.caption, color: "#9CA3AF", fontWeight: "500", fontSize: 12 },

  // Content
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },

  connectingCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dotsRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  bigDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.orange,
  },
  connectingTitle: {
    ...typography.body,
    color: "#4B5563",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
  },
  waitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  waitLabel: { ...typography.body, color: "#4B5563", fontWeight: "600", fontSize: 15 },
  waitValue: { ...typography.body, color: "#4B5563", fontWeight: "600", fontSize: 15 },
  waitSub: {
    ...typography.caption,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    fontSize: 13,
  },

  agentPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
  },
  agentAvatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#312E81",
    alignItems: "center",
    justifyContent: "center",
  },
  agentPreviewLabel: { ...typography.caption, color: "#9CA3AF", fontSize: 13, fontWeight: "500" },
  agentPreviewName: { ...typography.body, color: "#4B5563", fontWeight: "600", fontSize: 16, marginTop: 4 },

  // Connected state
  connectedCard: {
    backgroundColor: colors.greenSoft,
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.green,
  },
  connectedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  connectedCheck: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  connectedTitle: { ...typography.title, color: colors.green, fontWeight: "900" },
  connectedSub: { ...typography.body, color: colors.subtext, marginTop: 6 },

  // Action buttons
  actionsWrap: { marginTop: 24, gap: 12 },
  actionBtn: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionBtnPressed: { opacity: 0.8, backgroundColor: "#F9FAFB" },
  actionBtnText: { ...typography.body, color: "#4B5563", fontWeight: "600", fontSize: 15 },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    ...typography.body,
    color: colors.text,
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
});
