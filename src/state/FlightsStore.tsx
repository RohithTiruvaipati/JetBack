import React from "react";
import { savedFlights as initialFlights } from "@/data/dummy";
import type { SavedFlight } from "@/data/dummy";

type FlightsContextValue = {
  flights: SavedFlight[];
  getFlight: (id: string) => SavedFlight | undefined;
  updateFlight: (id: string, patch: Partial<SavedFlight>) => void;
  rebookFlight: (
    originalFlightId: string,
    next: Pick<
      SavedFlight,
      "airline" | "flightNumber" | "departTime" | "arriveTime" | "terminal" | "status" | "statusLabel" | "priceUsd"
    >
  ) => void;
};

const FlightsContext = React.createContext<FlightsContextValue | null>(null);

export function FlightsProvider({ children }: { children: React.ReactNode }) {
  const [flights, setFlights] = React.useState<SavedFlight[]>(() => initialFlights);

  const getFlight = React.useCallback(
    (id: string) => flights.find((f) => f.id === id),
    [flights]
  );

  const updateFlight = React.useCallback((id: string, patch: Partial<SavedFlight>) => {
    setFlights((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const rebookFlight: FlightsContextValue["rebookFlight"] = React.useCallback(
    (originalFlightId, next) => {
      updateFlight(originalFlightId, next);
    },
    [updateFlight]
  );

  const value = React.useMemo<FlightsContextValue>(
    () => ({ flights, getFlight, updateFlight, rebookFlight }),
    [flights, getFlight, updateFlight, rebookFlight]
  );

  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>;
}

export function useFlights() {
  const ctx = React.useContext(FlightsContext);
  if (!ctx) throw new Error("useFlights must be used within FlightsProvider");
  return ctx;
}

