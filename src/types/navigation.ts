// ─── Bottom tab navigator ────────────────────────────────────────────
export type RootTabParamList = {
  FlightsTab: undefined;
  MessagesTab: undefined;
  RebookTab: undefined;
};

// ─── Auth stack (shown before tabs) ─────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
};

// ─── Flights stack (nested inside FlightsTab) ────────────────────────
export type FlightsStackParamList = {
  SavedFlights: undefined;
  FlightStatus: { flightId: string };
  PassengerRights: undefined;
};

// ─── Messages stack (nested inside MessagesTab) ──────────────────────
export type MessagesStackParamList = {
  ChatList: undefined;
  ChatConversation: { conversationId: string };
  AgentEscalation: { conversationId: string };
};

// ─── Rebook stack (nested inside RebookTab) ─────────────────────────
export type RebookStackParamList = {
  RebookFlight: { originalFlightId?: string } | undefined;
  RebookConfirm: { originalFlightId: string; selectedFlightId: string };
};

// ─── Legacy union kept for any cross-stack navigations ───────────────
export type RootStackParamList = FlightsStackParamList & MessagesStackParamList;

// ─── App root stack ────────────────────────────────────────────────
export type AppRootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
