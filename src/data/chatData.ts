// ─── Chat data models, mock data, and bot-response engine ──────────────

export type MessageSender = "bot" | "user" | "agent" | "system";

export type Message = {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  timestamp: number; // epoch ms
};

export type ConversationStatus = "active" | "resolved" | "escalated";

export type Conversation = {
  id: string;
  title: string;
  subtitle: string;
  avatarType: "bot" | "agent";
  lastMessage: string;
  lastTimestamp: number;
  status: ConversationStatus;
  unread: boolean;
};

// ─── quick-action chips shown at bottom of chat ───────────────────────
export const quickActions = [
  "Track baggage",
  "Change booking",
  "Contact support",
  "Rebook flight",
  "Hotel info",
] as const;
export type QuickAction = (typeof quickActions)[number];

// ─── mock conversations ──────────────────────────────────────────────
const now = Date.now();
const hour = 3_600_000;

export const conversations: Conversation[] = [
  {
    id: "conv-sarah",
    title: "Sarah Miller",
    subtitle: "Customer Support Agent",
    avatarType: "agent",
    lastMessage: "Your flight is confirmed for 3:45 PM. H…",
    lastTimestamp: now - 2 * hour,
    status: "active",
    unread: true,
  },
  {
    id: "conv-bot-today",
    title: "jetBack Assistant",
    subtitle: "Virtual Assistant",
    avatarType: "bot",
    lastMessage: "I'd be happy to help you check your fli…",
    lastTimestamp: now - 4 * hour,
    status: "active",
    unread: true,
  },
  {
    id: "conv-michael",
    title: "Michael Chen",
    subtitle: "Customer Support Agent",
    avatarType: "agent",
    lastMessage: "I've processed your refund. You shou…",
    lastTimestamp: now - 24 * hour,
    status: "resolved",
    unread: false,
  },
  {
    id: "conv-bot-old",
    title: "jetBack Assistant",
    subtitle: "Virtual Assistant",
    avatarType: "bot",
    lastMessage: "Your baggage tracking number is JB8…",
    lastTimestamp: now - 72 * hour,
    status: "resolved",
    unread: false,
  },
  {
    id: "conv-emily",
    title: "Emily Rodriguez",
    subtitle: "Customer Support Agent",
    avatarType: "agent",
    lastMessage: "Thank you for choosing jetBack! Your …",
    lastTimestamp: now - 168 * hour,
    status: "resolved",
    unread: false,
  },
];

// ─── mock messages for the bot conversation ──────────────────────────
export const botConversationMessages: Message[] = [
  {
    id: "m1",
    conversationId: "conv-bot-today",
    sender: "bot",
    text: "Hi there! 👋 Welcome to jetBack! I'm your virtual assistant. How can I help you today?",
    timestamp: now - 4 * hour,
  },
  {
    id: "m2",
    conversationId: "conv-bot-today",
    sender: "user",
    text: "Hi! I need help checking my flight status",
    timestamp: now - 3.95 * hour,
  },
  {
    id: "m3",
    conversationId: "conv-bot-today",
    sender: "bot",
    text: "I'd be happy to help you check your flight status! Could you please provide me with your booking reference or flight number?",
    timestamp: now - 3.9 * hour,
  },
  {
    id: "m4",
    conversationId: "conv-bot-today",
    sender: "user",
    text: "My booking reference is JB7834",
    timestamp: now - 3.85 * hour,
  },
];

// ─── Flight rebook data ──────────────────────────────────────────────
export type RebookOption = {
  flightNumber: string;
  departure: string;
  arrival: string;
  airline: string;
  status: string;
};

export const rebookOptions: RebookOption[] = [
  { flightNumber: "AA 2048", departure: "12:30 PM", arrival: "3:45 PM", airline: "American", status: "Available" },
  { flightNumber: "AA 2099", departure: "2:15 PM", arrival: "5:30 PM", airline: "American", status: "Available" },
  { flightNumber: "UA 1234", departure: "3:00 PM", arrival: "6:15 PM", airline: "United", status: "Limited" },
];

// ─── Hotel data ──────────────────────────────────────────────────────
export type HotelOption = {
  name: string;
  distance: string;
  price: string;
  rating: number;
  available: boolean;
};

export const hotelOptions: HotelOption[] = [
  { name: "Hyatt Regency DFW", distance: "0.3 mi from terminal", price: "$149/night", rating: 4.5, available: true },
  { name: "Grand Hyatt DFW", distance: "In-terminal", price: "$219/night", rating: 4.8, available: true },
  { name: "Marriott DFW Airport", distance: "1.2 mi", price: "$129/night", rating: 4.2, available: true },
];

// ─── Bot intelligence (pattern-matching, runs on-device) ─────────────
let _msgCounter = 100;
function nextId(): string {
  return `m${++_msgCounter}`;
}

export function generateBotReply(userText: string): Message {
  const lower = userText.toLowerCase();
  let reply: string;

  if (lower.includes("rebook") || lower.includes("change flight") || lower.includes("alternative")) {
    const options = rebookOptions
      .map((o) => `✈ ${o.flightNumber} — Departs ${o.departure}, arrives ${o.arrival} (${o.status})`)
      .join("\n");
    reply = `I found these available flights for rebooking from DFW → LAX:\n\n${options}\n\nWould you like me to rebook you on any of these? Just reply with the flight number.`;
  } else if (lower.includes("hotel") || lower.includes("accommodation") || lower.includes("stay")) {
    const options = hotelOptions
      .map((h) => `🏨 ${h.name} — ${h.distance} — ${h.price} (⭐ ${h.rating})`)
      .join("\n");
    reply = `Here are hotels near DFW Airport:\n\n${options}\n\nWould you like me to reserve a room? I can also check for airline-provided vouchers.`;
  } else if (lower.includes("baggage") || lower.includes("luggage") || lower.includes("bag")) {
    reply = "I can help track your baggage! Your tracking number is JB8834. Current status: In transit — expected delivery to carousel B12 at 2:30 PM. Would you like me to set up notifications?";
  } else if (lower.includes("refund") || lower.includes("compensation") || lower.includes("money")) {
    reply = "For refund and compensation claims, I can start the process for you. Under DOT regulations, you may be entitled to compensation for delays over 3 hours. Would you like me to file a claim, or would you prefer to speak with a customer support agent?";
  } else if (lower.includes("status") || lower.includes("flight")) {
    reply = "Your flight AA 2047 DFW → LAX is currently delayed by 2h 30m. New departure: 10:30 AM, estimated arrival: 1:45 PM. Gate: D18, Terminal D. Would you like to rebook or explore delay resources?";
  } else if (lower.includes("agent") || lower.includes("human") || lower.includes("person") || lower.includes("support") || lower.includes("help me")) {
    reply = "I understand you'd like to speak with a customer support agent. Let me connect you right away. Estimated wait time: ~2 minutes.";
  } else if (lower.includes("voucher") || lower.includes("meal") || lower.includes("food")) {
    reply = "✅ I've checked your eligibility — you qualify for a $15 meal voucher due to the flight delay. I can send it to your email or display a QR code. Which would you prefer?";
  } else if (lower.includes("notification") || lower.includes("alert") || lower.includes("notify")) {
    reply = "✅ Notifications are now set up! You'll receive real-time updates for flight AA 2047 via push notification. I'll alert you about any gate changes, boarding updates, or further delays.";
  } else if (lower.includes("thank") || lower.includes("thanks")) {
    reply = "You're welcome! 😊 Is there anything else I can help you with?";
  } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    reply = "Hello! 👋 How can I assist you today? I can help with flight status, rebooking, hotel info, baggage tracking, and more!";
  } else {
    reply = "I'd be happy to help! Could you provide a bit more detail? I can assist with:\n\n• Flight status & rebooking\n• Hotel availability & prices\n• Baggage tracking\n• Refunds & compensation\n• Meal vouchers\n\nOr I can connect you with a live support agent.";
  }

  return {
    id: nextId(),
    conversationId: "conv-bot-today",
    sender: "bot",
    text: reply,
    timestamp: Date.now(),
  };
}

// ─── Check if the message warrants escalation ────────────────────────
export function shouldEscalate(userText: string): boolean {
  const lower = userText.toLowerCase();
  return (
    lower.includes("agent") ||
    lower.includes("human") ||
    lower.includes("person") ||
    lower.includes("representative") ||
    lower.includes("speak to someone") ||
    lower.includes("connect me")
  );
}

// ─── System Logger — logs all interactions for service tracking ──────
export type LogEntry = {
  id: string;
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  action: string;
  details?: string;
  conversationId?: string;
};

let _logId = 0;
const _logs: LogEntry[] = [];

export function systemLog(
  level: LogEntry["level"],
  action: string,
  details?: string,
  conversationId?: string
): void {
  const entry: LogEntry = {
    id: `log-${++_logId}`,
    timestamp: Date.now(),
    level,
    action,
    details,
    conversationId,
  };
  _logs.push(entry);
  // Keep logs bounded to prevent memory issues (< 1GB requirement)
  if (_logs.length > 5000) _logs.splice(0, 1000);
  if (__DEV__) {
    console.log(`[jetBack:${level}] ${action}${details ? ` — ${details}` : ""}`);
  }
}

export function getLogs(): readonly LogEntry[] {
  return _logs;
}

// ─── Session persistence helpers (survives connectivity drops) ───────
export type ChatSession = {
  conversationId: string;
  messages: Message[];
  lastSyncTimestamp: number;
  isOnline: boolean;
};

let _pendingMessages: Message[] = [];

export function queueOfflineMessage(msg: Message): void {
  _pendingMessages.push(msg);
  systemLog("info", "message_queued_offline", `Queued message: ${msg.id}`, msg.conversationId);
}

export function flushOfflineMessages(): Message[] {
  const flushed = [..._pendingMessages];
  _pendingMessages = [];
  if (flushed.length > 0) {
    systemLog("info", "offline_messages_flushed", `${flushed.length} messages synced`);
  }
  return flushed;
}

export function getPendingMessages(): readonly Message[] {
  return _pendingMessages;
}

// ─── Time formatting ─────────────────────────────────────────────────
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return "Last week";
}

export function formatMessageTime(timestamp: number): string {
  const d = new Date(timestamp);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}
