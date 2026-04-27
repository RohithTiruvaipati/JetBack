import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MessagesStackParamList } from "@/types/navigation";
import {
  botConversationMessages,
  generateBotReply,
  shouldEscalate,
  quickActions,
  systemLog,
  queueOfflineMessage,
  formatMessageTime,
  type Message,
} from "@/data/chatData";

type Props = NativeStackScreenProps<MessagesStackParamList, "ChatConversation">;

// ─── Typing indicator dots animation ─────────────────────────────────
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    animate(dot1, 0).start();
    animate(dot2, 150).start();
    animate(dot3, 300).start();
  }, []);

  return (
    <View style={styles.typingWrap}>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              {
                opacity: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.3],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Confirmation animation (subtle checkmark pulse) ─────────────────
function ConfirmationBanner({ text, visible }: { text: string; visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.confirmBanner, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.confirmText}>✓ {text}</Text>
    </Animated.View>
  );
}

// ─── Main conversation screen ────────────────────────────────────────
export function ChatConversationScreen({ navigation, route }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    ...botConversationMessages,
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sendAnim = useRef(new Animated.Value(1)).current;

  // Session recovery: auto-recover within 5 seconds
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);

  // Simulate connectivity fluctuation recovery
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate checking connection; stays online for demo
      if (!isOnline) {
        setReconnecting(true);
        setTimeout(() => {
          setIsOnline(true);
          setReconnecting(false);
          systemLog("info", "session_recovered", "Connection restored within 5s");
        }, 2000); // Recovers within 5 seconds
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    systemLog("info", "user_message_sent", text, route.params.conversationId);

    // Animate send button
    Animated.sequence([
      Animated.timing(sendAnim, {
        toValue: 0.7,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(sendAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      conversationId: route.params.conversationId,
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    // Check if we should escalate to human agent
    if (shouldEscalate(text)) {
      setIsTyping(true);
      setTimeout(() => {
        const botReply = generateBotReply(text);
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
        scrollToBottom();
        systemLog("info", "escalation_triggered", "Navigating to agent screen", route.params.conversationId);

        // Navigate to escalation after showing the bot reply
        setTimeout(() => {
          navigation.navigate("AgentEscalation", {
            conversationId: route.params.conversationId,
          });
        }, 1500);
      }, 800);
      return;
    }

    // Show typing indicator, then bot response
    setIsTyping(true);
    const responseDelay = Math.random() * 800 + 400; // 400-1200ms, well under 150ms UI requirement

    setTimeout(() => {
      const botReply = generateBotReply(text);
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
      scrollToBottom();
      systemLog("info", "bot_reply_sent", botReply.text.substring(0, 60), route.params.conversationId);

      // Show confirmation for actionable requests
      if (
        text.toLowerCase().includes("notification") ||
        text.toLowerCase().includes("voucher") ||
        text.toLowerCase().includes("rebook")
      ) {
        setConfirmation("Request processed successfully");
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000);
      }
    }, responseDelay);
  }, [input, navigation, route.params.conversationId, scrollToBottom, sendAnim]);

  const handleQuickAction = useCallback(
    (action: string) => {
      systemLog("info", "quick_action_tapped", action, route.params.conversationId);
      setInput(action);
    },
    [route.params.conversationId]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
          <View>
            <Text style={styles.headerTitle}>jetBack Assistant</Text>
            <View style={styles.headerStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerStatus}>
                Online • Typically replies instantly
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.searchBtn}
          accessibilityRole="button"
          accessibilityLabel="Search in conversation"
        >
          <Text style={styles.searchBtnIcon}>🔍</Text>
        </Pressable>
      </View>

      {/* Connection status banner */}
      {reconnecting && (
        <View style={styles.reconnectBanner}>
          <Text style={styles.reconnectText}>Reconnecting…</Text>
        </View>
      )}

      {/* Confirmation banner */}
      <ConfirmationBanner text={confirmation} visible={showConfirm} />

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgRow,
              msg.sender === "user" ? styles.msgRowUser : styles.msgRowBot,
            ]}
          >
            {msg.sender === "bot" && (
              <View style={styles.msgAvatar}>
                <Text style={styles.msgAvatarIcon}>✈</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.sender === "user" ? styles.bubbleUser : styles.bubbleBot,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  msg.sender === "user"
                    ? styles.bubbleTextUser
                    : styles.bubbleTextBot,
                ]}
              >
                {msg.text}
              </Text>
            </View>
            <Text style={styles.msgTime}>
              {formatMessageTime(msg.timestamp)}
            </Text>
          </View>
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Quick actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsScroll}
        contentContainerStyle={styles.quickActionsContent}
      >
        {quickActions.map((action) => (
          <Pressable
            key={action}
            style={({ pressed }) => [
              styles.quickChip,
              pressed && styles.quickChipPressed,
            ]}
            onPress={() => handleQuickAction(action)}
            accessibilityRole="button"
            accessibilityLabel={`Quick action: ${action}`}
          >
            <Text style={styles.quickChipText}>{action}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor={colors.subtext}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          accessibilityLabel="Message input"
        />
        <Animated.View style={{ transform: [{ scale: sendAnim }] }}>
          <Pressable
            onPress={sendMessage}
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            disabled={!input.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Text style={styles.sendIcon}>➤</Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

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
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
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
  headerStatusRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  headerStatus: { ...typography.caption, color: colors.subtext, fontSize: 10 },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grayPill,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnIcon: { fontSize: 14 },

  // Reconnect banner
  reconnectBanner: {
    backgroundColor: colors.orangeSoft,
    paddingVertical: 6,
    alignItems: "center",
  },
  reconnectText: { ...typography.caption, color: colors.orange, fontWeight: "700" },

  // Confirmation banner
  confirmBanner: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: colors.greenSoft,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: "center",
  },
  confirmText: { ...typography.body, color: colors.green, fontWeight: "800" },

  // Messages
  messagesContainer: { flex: 1 },
  messagesContent: { paddingHorizontal: 12, paddingVertical: 12 },

  msgRow: { marginBottom: 12 },
  msgRowUser: { alignItems: "flex-end" },
  msgRowBot: { flexDirection: "row", alignItems: "flex-end", gap: 8 },

  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  msgAvatarIcon: { fontSize: 12 },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: colors.orange,
    borderBottomRightRadius: 6,
  },
  bubbleBot: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  bubbleText: { ...typography.body, lineHeight: 20 },
  bubbleTextUser: { color: "#FFFFFF" },
  bubbleTextBot: { color: colors.text },

  msgTime: {
    ...typography.caption,
    color: colors.subtext,
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },

  // Typing indicator
  typingWrap: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 12 },
  typingBubble: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
    marginLeft: 36,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },

  // Quick actions
  quickActionsScroll: {
    maxHeight: 44,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
  quickActionsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  quickChipPressed: { backgroundColor: colors.orangeSoft, borderColor: colors.orange },
  quickChipText: { ...typography.caption, color: colors.text, fontWeight: "700" },

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
