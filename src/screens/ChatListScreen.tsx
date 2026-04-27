import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { TopBar } from "@/components/TopBar";
import {
  conversations,
  formatRelativeTime,
  systemLog,
} from "@/data/chatData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, MessagesStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<MessagesStackParamList, "ChatList">;
type Filter = "all" | "active" | "resolved";

export function ChatListScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    if (filter === "resolved" && c.status !== "resolved") return false;
    if (filter === "active" && c.status === "resolved") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openConversation = useCallback(
    (convId: string) => {
      systemLog("info", "conversation_opened", `convId=${convId}`, convId);
      navigation.navigate("ChatConversation", { conversationId: convId });
    },
    [navigation]
  );

  const openNewChat = useCallback(() => {
    systemLog("info", "new_chat_started", "User started new chat with bot");
    navigation.navigate("ChatConversation", {
      conversationId: "conv-bot-today",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TopBar title="Messages" rightIcon="💬" onRightPress={openNewChat} />

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.subtext}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Search conversations"
          />
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.tabWrap}>
        <FilterChip
          label="All Chats"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterChip
          label="Active"
          active={filter === "active"}
          onPress={() => setFilter("active")}
        />
        <FilterChip
          label="Resolved"
          active={filter === "resolved"}
          onPress={() => setFilter("resolved")}
        />
      </View>

      {/* Conversation list */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((conv) => (
          <Pressable
            key={conv.id}
            style={({ pressed }) => [
              styles.convCard,
              pressed && styles.convCardPressed,
            ]}
            onPress={() => openConversation(conv.id)}
            accessibilityRole="button"
            accessibilityLabel={`Open conversation with ${conv.title}`}
          >
            <View style={styles.convRow}>
              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  conv.avatarType === "bot" && styles.avatarBot,
                ]}
              >
                {conv.avatarType === "bot" ? (
                  <Text style={styles.avatarBotIcon}>✈</Text>
                ) : (
                  <Text style={styles.avatarAgentIcon}>👤</Text>
                )}
              </View>

              {/* Info */}
              <View style={styles.convInfo}>
                <View style={styles.convTopRow}>
                  <View style={styles.convNameRow}>
                    {conv.unread && <View style={styles.unreadDot} />}
                    <Text style={styles.convName} numberOfLines={1}>
                      {conv.title}
                    </Text>
                  </View>
                  <Text style={styles.convTime}>
                    {formatRelativeTime(conv.lastTimestamp)}
                  </Text>
                </View>
                <Text style={styles.convSubtitle}>{conv.subtitle}</Text>
                <Text style={styles.convMessage} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}



// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  searchWrap: { paddingHorizontal: 16, paddingBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },

  tabWrap: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  filterChipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.subtext,
    fontWeight: "700",
  },
  filterChipTextActive: { color: "#FFFFFF" },

  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 1 },
  convCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  convCardPressed: { opacity: 0.85 },
  convRow: { flexDirection: "row", alignItems: "center" },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayPill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarBot: { backgroundColor: colors.orangeSoft },
  avatarBotIcon: { fontSize: 18 },
  avatarAgentIcon: { fontSize: 18 },

  convInfo: { flex: 1 },
  convTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  convNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  convName: { ...typography.body, color: colors.text, fontWeight: "800" },
  convTime: { ...typography.caption, color: colors.subtext },
  convSubtitle: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 2,
  },
  convMessage: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 4,
  },
  chevron: { fontSize: 18, color: colors.subtext, fontWeight: "900" },

  emptyWrap: { paddingTop: 40, alignItems: "center" },
  emptyText: { ...typography.body, color: colors.subtext },

});
