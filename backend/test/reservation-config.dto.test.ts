import { describe, expect, it } from "vitest";
import { reservationConfigView } from "@/modules/reservations/application/dto/reservation-config.dto";

describe("reservation config response", () => {
  it("exposes only public reservation UI configuration", () => {
    const config = reservationConfigView();

    expect(config.depositPerSeat).toBe(100000);
    expect(config.sessions.length).toBeGreaterThan(0);
    expect(config.seats.map((seat) => seat.code)).toContain("C1");
    expect(config).not.toHaveProperty("accountNumber");
    expect(config).not.toHaveProperty("bankCode");
  });
});
