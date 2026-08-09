import crypto from "crypto";
import mongoose from "mongoose";
import ReservationRepository from "./reservation.repository";
import { ReservationSeatHoldRepository } from "./reservation-seat-hold.model";
import type {
  ReservationRepositoryPort,
  ReservationSeatHoldPort,
} from "./domain/ports/reservation.ports";
import { BadRequestError, ConflictError, NotFoundError } from "@/utils/common/error.util";
import { vnpay, ProductCode, VnpLocale, dateFormat } from "@/utils/payment/vnpay.util";
import { CreateReservationInput } from "./reservation.types";
import {
  calculateDeposit,
  getSessionById,
  RESERVATION_CONFIG,
} from "@itsu-sushi/shared/config/reservation.config";
import { SEATS } from "@itsu-sushi/shared/config/seat-map.config";
import { ReservationStatusType } from "@itsu-sushi/shared/schemas/reservation.schema";
import { env } from "@/core/config/env.config";

export default class ReservationService {
  constructor(
    private readonly reservationRepo: ReservationRepositoryPort = new ReservationRepository(),
    private readonly seatHoldRepo: ReservationSeatHoldPort = new ReservationSeatHoldRepository(),
  ) {}

  async createReservation(data: CreateReservationInput, ipAddr: string, userId: string) {
    this.validateBooking(data);

    const totalDeposit = calculateDeposit(data.seatCodes.length);
    if (data.totalDeposit !== totalDeposit) {
      throw new BadRequestError(`Invalid deposit amount. Expected ${totalDeposit} VND`);
    }

    const txnRef = `RES_${crypto.randomUUID().replace(/-/g, "")}`;
    const paymentExpiredAt = new Date(Date.now() + RESERVATION_CONFIG.paymentExpiryMinutes * 60_000);
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalDeposit,
      vnp_IpAddr: ipAddr.split(",")[0].trim(),
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Reservation ${data.session} - ${data.slotId}`,
      vnp_OrderType: ProductCode.Cuisine,
      vnp_ReturnUrl: env.VNP_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(paymentExpiredAt),
    });

    const dbSession = await mongoose.startSession();
    try {
      const legacyOccupiedSeats = await this.reservationRepo.findOccupiedSeats(
        data.reservationDate,
        data.session,
        data.slotId,
      );
      if (data.seatCodes.some((seatCode) => legacyOccupiedSeats.includes(seatCode))) {
        throw new ConflictError("One or more selected seats are no longer available");
      }

      let reservation;
      await dbSession.withTransaction(async () => {
        reservation = await this.reservationRepo.create({
          ...data,
          userId,
          vnp_TxnRef: txnRef,
          status: "PENDING_PAYMENT",
          paymentExpiredAt,
        }, dbSession);

        try {
          await this.seatHoldRepo.createMany(data.seatCodes.map((seatCode) => ({
            reservationId: reservation!.id,
            reservationDate: data.reservationDate,
            session: data.session,
            slotId: data.slotId,
            seatCode,
            status: "HELD" as const,
            expiresAt: paymentExpiredAt,
          })), dbSession);
        } catch (error) {
          if (this.isDuplicateKeyError(error)) {
            throw new ConflictError("One or more selected seats are no longer available");
          }
          throw error;
        }
      });

      return { reservation, paymentUrl };
    } finally {
      await dbSession.endSession();
    }
  }

  async handleVNPayCallback(query: Record<string, unknown>) {
    const verify = vnpay.verifyReturnUrl(query as never);
    if (!verify.isVerified) throw new BadRequestError("Invalid payment signature");

    const txnRef = verify.vnp_TxnRef;
    const reservation = await this.reservationRepo.findByTxnRef(txnRef);
    if (!reservation) throw new NotFoundError("Reservation not found");

    if (verify.vnp_Amount !== reservation.totalDeposit) {
      throw new BadRequestError("Payment amount does not match reservation");
    }

    if (verify.vnp_ResponseCode === "00") {
      if (reservation.status === "PAID") return reservation;
      if (reservation.status !== "PENDING_PAYMENT") return null;
      if (reservation.paymentExpiredAt && reservation.paymentExpiredAt <= new Date()) {
        await this.cancelPendingReservation(reservation.vnp_TxnRef);
        return null;
      }

      return this.transitionPendingReservation(reservation, "PAID");
    }

    if (["PAID", "COMPLETED"].includes(reservation.status)) return reservation;
    if (reservation.status !== "PENDING_PAYMENT") return reservation;
    return this.transitionPendingReservation(reservation, "CANCELLED");
  }

  async getReservations() {
    return this.reservationRepo.findAll();
  }

  async getReservationsByUserId(userId: string) {
    return this.reservationRepo.findByUserId(userId);
  }

  async getReservationById(id: string) {
    return this.reservationRepo.findById(id);
  }

  async updateReservationStatus(id: string, status: ReservationStatusType) {
    const reservation = await this.reservationRepo.findById(id);
    if (!reservation) throw new BadRequestError("Reservation not found");
    return this.reservationRepo.updateById(id, { status });
  }

  async deleteReservation(id: string) {
    const reservation = await this.reservationRepo.findById(id);
    if (!reservation) throw new BadRequestError("Reservation not found");
    await this.seatHoldRepo.releaseByReservationId(id);
    return this.reservationRepo.deleteById(id);
  }

  async getOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]> {
    this.validateBookingSlot(date, session, slotId);
    const [legacySeats, heldSeats] = await Promise.all([
      this.reservationRepo.findOccupiedSeats(date, session, slotId),
      this.seatHoldRepo.findOccupiedSeats(date, session, slotId),
    ]);
    return [...new Set([...legacySeats, ...heldSeats])];
  }

  private validateBooking(data: CreateReservationInput): void {
    this.validateBookingSlot(data.reservationDate, data.session, data.slotId);
    if (data.seatCodes.length > RESERVATION_CONFIG.maxSeatsPerReservation) {
      throw new BadRequestError(`A reservation can contain at most ${RESERVATION_CONFIG.maxSeatsPerReservation} seats`);
    }

    const validSeats = new Set(SEATS.map((seat) => seat.code));
    const invalidSeats = data.seatCodes.filter((seatCode) => !validSeats.has(seatCode));
    if (invalidSeats.length > 0) {
      throw new BadRequestError(`Invalid seat code: ${invalidSeats[0]}`);
    }
  }

  private validateBookingSlot(date: string, session: string, slotId: string): void {
    const dateParts = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
    if (
      dateParts.length !== 3 ||
      parsedDate.getUTCFullYear() !== dateParts[0] ||
      parsedDate.getUTCMonth() !== dateParts[1] - 1 ||
      parsedDate.getUTCDate() !== dateParts[2]
    ) {
      throw new BadRequestError("Reservation date is invalid");
    }

    const todayParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const today = [
      todayParts.find((part) => part.type === "year")?.value,
      todayParts.find((part) => part.type === "month")?.value,
      todayParts.find((part) => part.type === "day")?.value,
    ].join("-");
    if (date < today) throw new BadRequestError("Reservation date cannot be in the past");

    const sessionConfig = getSessionById(session as "lunch" | "dinner");
    if (!sessionConfig || !sessionConfig.slots.some((slot) => slot.id === slotId)) {
      throw new BadRequestError("Session and time slot do not match");
    }
  }

  private async transitionPendingReservation(
    reservation: { id: string; vnp_TxnRef: string; reservationDate: string; session: "lunch" | "dinner"; slotId: string },
    nextStatus: "PAID" | "CANCELLED",
  ) {
    const dbSession = await mongoose.startSession();
    try {
      let updated;
      await dbSession.withTransaction(async () => {
        updated = await this.reservationRepo.updateStatus(
          reservation.vnp_TxnRef,
          "PENDING_PAYMENT",
          nextStatus,
          dbSession,
        );
        if (!updated) return;

        if (nextStatus === "PAID") {
          const slot = getSessionById(reservation.session)!.slots.find((item) => item.id === reservation.slotId)!;
          const expiresAt = new Date(`${reservation.reservationDate}T${slot.endTime}:00+07:00`);
          await this.seatHoldRepo.confirmByReservationId(reservation.id, expiresAt, dbSession);
        } else {
          await this.seatHoldRepo.releaseByReservationId(reservation.id, dbSession);
        }
      });
      return updated ?? (await this.reservationRepo.findByTxnRef(reservation.vnp_TxnRef));
    } finally {
      await dbSession.endSession();
    }
  }

  private async cancelPendingReservation(txnRef: string): Promise<void> {
    const reservation = await this.reservationRepo.findByTxnRef(txnRef);
    if (!reservation || reservation.status !== "PENDING_PAYMENT") return;
    await this.transitionPendingReservation(reservation, "CANCELLED");
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000;
  }
}
