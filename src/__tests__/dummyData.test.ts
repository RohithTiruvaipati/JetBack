import { savedFlights } from "@/data/dummy";

test("dummy saved flights exist", () => {
  expect(savedFlights.length).toBeGreaterThanOrEqual(3);
  expect(savedFlights[0]).toHaveProperty("flightNumber");
});

