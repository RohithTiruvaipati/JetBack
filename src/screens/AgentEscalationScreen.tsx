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
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text style={styles.backChev}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarIcon}>✈</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>JetBack Support</Text>
            <Text style={styles.headerSubtitle}>
              Connecting to a live agent
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

            {/* Agent preview */}
            <View style={styles.agentPreview}>
              <View style={styles.agentAvatarLarge}>
                <Text style={styles.agentAvatarIcon}>👤</Text>
              </View>
              <View>
                <Text style={styles.agentPreviewLabel}>Next Available Agent</Text>
                <Text style={styles.agentPreviewName}>
                  Agent Sarah{" "}
                  <Text style={styles.agentPreviewStatus}>(Connecting...)</Text>
                </Text>
              </View>
            </View>
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
              styles.actionBtnCancel,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleCancel}
            accessibilityRole="button"
          >
            <Text style={[styles.actionBtnText, styles.actionBtnCancelText]}>
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
          <Text style={styles.sendIcon}>➤</Text>
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
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backChev: { fontSize: 24, color: colors.subtext, fontWeight: "800" },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarIcon: { fontSize: 16 },
  headerTitle: { ...typography.h2, color: colors.text, fontWeight: "900" },
  headerSubtitle: { ...typography.caption, color: colors.subtext, fontSize: 10 },
  connectingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  connectingDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  connectingBadgeText: { ...typography.caption, color: colors.green, fontWeight: "700", fontSize: 10 },

  // Content
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },

  connectingCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  dotsRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  bigDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.orange,
  },
  connectingTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 22,
  },
  waitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  waitLabel: { ...typography.body, color: colors.subtext },
  waitValue: { ...typography.body, color: colors.text, fontWeight: "900" },
  waitSub: {
    ...typography.caption,
    color: colors.subtext,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },

  agentPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    backgroundColor: colors.grayPill,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    width: "100%",
  },
  agentAvatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  agentAvatarIcon: { fontSize: 20 },
  agentPreviewLabel: { ...typography.caption, color: colors.subtext },
  agentPreviewName: { ...typography.body, color: colors.text, fontWeight: "800", marginTop: 2 },
  agentPreviewStatus: { color: colors.subtext, fontWeight: "500" },

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
  actionsWrap: { marginTop: 20, gap: 10 },
  actionBtn: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionBtnPressed: { opacity: 0.8, backgroundColor: colors.grayPill },
  actionBtnText: { ...typography.body, color: colors.text, fontWeight: "800" },
  actionBtnCancel: { borderColor: colors.orange },
  actionBtnCancelText: { color: colors.orange },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.grayPill,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...typography.body,
    color: colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
});
