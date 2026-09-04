import { describe, expect, it } from "vitest";
import { ConfirmCustomerPaymentUseCase, ApproveManualPaymentUseCase } from "@/modules/reservations/application/use-cases/reservation.use-cases";
import type { ReservationEntity } from "@/modules/reservations/domain/entities/reservation.entity";
import type { ReservationRepository } from "@/modules/reservations/domain/ports/reservation-repository.port";
import type { ReservationSeatHoldRepository } from "@/modules/reservations/domain/ports/seat-hold-repository.port";
import type { ReservationPayment } from "@/modules/payments/domain/entities/payment.entity";
import type { ReservationPaymentRepository } from "@/modules/payments/domain/ports/payment-repository.port";
import type { UnitOfWork } from "@/core/transactions/transaction.port";
import type { Clock } from "@/core/ports/clock.port";

const now = new Date("2026-08-09T10:00:00.000Z");
const reservation: ReservationEntity = { id: "r1", userId: "u1", customerName: "Customer", customerPhone: "0901234567", reservationDate: "2099-01-01", session: "lunch", slotId: "LUNCH_1", seatCodes: ["A1"], totalDeposit: 100000, transactionReference: "RES_1", paymentExpiredAt: new Date(now.getTime() + 60_000), status: "PENDING_PAYMENT", createdAt: now, updatedAt: now };
const payment: ReservationPayment = { id: "p1", reservationId: "r1", method: "VIETQR", amount: 100000, transactionReference: "RES_1", transferContent: "ITSU RES_1", status: "PENDING", bankCode: "VCB", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "ITSU", qrTemplate: "compact2", qrImageUrl: "https://example.com/qr", createdAt: now, updatedAt: now };

function fakes() {
  let currentReservation = { ...reservation };
  let currentPayment = { ...payment };
  const reservations: ReservationRepository = { create: async () => currentReservation, findById: async () => currentReservation, findByTransactionReference: async () => currentReservation, findByUserId: async () => [currentReservation], findAll: async () => [currentReservation], transition: async (_id, expected, next) => { if (currentReservation.status !== expected) return null; currentReservation = { ...currentReservation, status: next, approvalExpiresAt: next === "PENDING_APPROVAL" ? new Date(now.getTime() + 1_800_000) : currentReservation.approvalExpiresAt }; return currentReservation; }, updateStatus: async () => currentReservation, delete: async () => true, findOccupiedSeats: async () => [] };
  const holds: ReservationSeatHoldRepository = { createMany: async () => undefined, transitionByReservationId: async () => undefined, releaseByReservationId: async () => undefined, findOccupiedSeats: async () => [] };
  const payments: ReservationPaymentRepository = { create: async () => currentPayment, findByReservationId: async () => currentPayment, transition: async (_id, expected, next, patch) => { if (currentPayment.status !== expected) return null; currentPayment = { ...currentPayment, ...patch, status: next }; return currentPayment; } };
  const unit: UnitOfWork = { execute: async (work) => work({ id: Symbol("test") }) };
  const clock: Clock = { now: () => now };
  return { reservations, holds, payments, unit, clock, getReservation: () => currentReservation, getPayment: () => currentPayment };
}

describe("reservation payment workflow", () => {
  it("moves customer confirmation to pending approval", async () => {
    const f = fakes();
    const result = await new ConfirmCustomerPaymentUseCase(f.reservations, f.holds, f.payments, f.unit, f.clock).execute("r1", "u1");
    expect(result.reservation.status).toBe("PENDING_APPROVAL");
    expect(result.payment.status).toBe("PENDING_APPROVAL");
  });

  it("rejects an admin approval with an incorrect amount", async () => {
    const f = fakes();
    await new ConfirmCustomerPaymentUseCase(f.reservations, f.holds, f.payments, f.unit, f.clock).execute("r1", "u1");
    await expect(new ApproveManualPaymentUseCase(f.reservations, f.holds, f.payments, f.unit, f.clock).execute("r1", "admin", 1)).rejects.toThrow("Payment amount does not match reservation");
  });
});
