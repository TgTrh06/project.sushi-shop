import { describe, expect, it } from "vitest";
import type ReservationRepository from "./reservation.repository";
import { ReservationSeatHoldRepository } from "./reservation-seat-hold.model";
import ReservationService from "./reservation.service";

const createService = () => new ReservationService(
  {} as ReservationRepository,
  {} as ReservationSeatHoldRepository,
);

const validInput = {
  customerName: "Customer",
  customerPhone: "0901234567",
  reservationDate: "2099-01-01",
  session: "dinner" as const,
  slotId: "DINNER_1",
  seatCodes: ["A1"],
  totalDeposit: 100000,
};

describe("ReservationService validation", () => {
  it("rejects a date in the past", async () => {
    await expect(createService().createReservation({
      ...validInput,
      reservationDate: "2000-01-01",
    }, "127.0.0.1", "user-1")).rejects.toThrow("cannot be in the past");
  });

  it("rejects a slot that does not belong to the selected session", async () => {
    await expect(createService().createReservation({
      ...validInput,
      slotId: "LUNCH_1",
    }, "127.0.0.1", "user-1")).rejects.toThrow("do not match");
  });

  it("rejects an unknown seat code", async () => {
    await expect(createService().createReservation({
      ...validInput,
      seatCodes: ["NOT_A_SEAT"],
    }, "127.0.0.1", "user-1")).rejects.toThrow("Invalid seat code");
  });
});
