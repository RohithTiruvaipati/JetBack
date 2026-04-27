export type FlightStatus = "DELAYED" | "ON_TIME" | "BOARDING";

export type SavedFlight = {
  id: string;
  airline: "American" | "United" | "Southwest";
  flightNumber: string;
  fromCode: "DFW";
  fromCity: string;
  toCode: "LAX" | "ORD" | "ATL";
  toCity: string;
  departTime: string;
  arriveTime: string;
  terminal: string;
  gate: string;
  aircraft: string;
  status: FlightStatus;
  statusLabel: string;
};

export const savedFlights: SavedFlight[] = [
  {
    id: "aa2047",
    airline: "American",
    flightNumber: "AA 2047",
    fromCode: "DFW",
    fromCity: "Dallas",
    toCode: "LAX",
    toCity: "Los Angeles",
    departTime: "10:30 AM",
    arriveTime: "1:45 PM",
    terminal: "D",
    gate: "D18",
    aircraft: "Boeing 737",
    status: "DELAYED",
    statusLabel: "Delayed +2h 30m"
  },
  {
    id: "ua1182",
    airline: "United",
    flightNumber: "UA 1182",
    fromCode: "DFW",
    fromCity: "Dallas",
    toCode: "ORD",
    toCity: "Chicago",
    departTime: "1:15 PM",
    arriveTime: "4:50 PM",
    terminal: "E",
    gate: "E22",
    aircraft: "Airbus A320",
    status: "ON_TIME",
    statusLabel: "On Time"
  },
  {
    id: "sw408",
    airline: "Southwest",
    flightNumber: "SW 408",
    fromCode: "DFW",
    fromCity: "Dallas",
    toCode: "ATL",
    toCity: "Atlanta",
    departTime: "3:40 PM",
    arriveTime: "6:55 PM",
    terminal: "C",
    gate: "C9",
    aircraft: "Boeing 737 MAX",
    status: "BOARDING",
    statusLabel: "Boarding"
  }
];

export type TimelineItem = {
  id: string;
  label: string;
  time?: string;
  state: "done" | "active" | "upcoming";
};

export const flightTimelineAA2047: TimelineItem[] = [
  { id: "checkin", label: "Check-in Opens", time: "5:00 AM", state: "done" },
  { id: "boarding", label: "Boarding", time: "7:15 AM", state: "done" },
  { id: "orig", label: "Original Departure", time: "8:00 AM", state: "done" },
  { id: "new", label: "New Departure", time: "10:30 AM", state: "active" },
  { id: "arr", label: "Arrival (Est.)", time: "1:45 PM", state: "upcoming" }
];

export type PassengerRightItem = {
  id: string;
  title: string;
  subtitle: string;
};

export const passengerRights: PassengerRightItem[] = [
  { id: "tarmac", title: "Tarmac Delay Rule", subtitle: "DOT 3-Hour Rule" },
  { id: "denied", title: "Denied Boarding Compensation", subtitle: "Involuntary Bumping" },
  { id: "refund", title: "Refund Rights", subtitle: "Cancellations & Significant Delays" },
  { id: "delay", title: "Flight Delay Compensation", subtitle: "Carrier-Caused Delays" },
  { id: "baggage", title: "Baggage Rights", subtitle: "Lost, Delayed & Damaged Bags" }
];

