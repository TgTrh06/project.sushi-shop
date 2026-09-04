import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "@/core/errors";
import type { Clock } from "@/core/ports/clock.port";
import type { IdGenerator } from "@/core/ports/id-generator.port";
import type { UnitOfWork } from "@/core/transactions/transaction.port";
import { calculateDeposit, getSessionById, RESERVATION_CONFIG } from "../../domain/config/reservation.config";
import { SEATS } from "../../domain/config/seat-map.config";
import type { ReservationEntity, ReservationSession, ReservationStatus } from "../../domain/entities/reservation.entity";
import type { ReservationSeatHoldRepository } from "../../domain/ports/seat-hold-repository.port";
import type { ReservationRepository } from "../../domain/ports/reservation-repository.port";
import type { PaymentSettingsRepository, ReservationPaymentRepository } from "@/modules/payments/domain/ports/payment-repository.port";
import type { VietQrGenerator } from "@/modules/payments/domain/ports/vietqr-generator.port";
import type { CreateReservationCommand, CreateReservationResult } from "../dto/reservation.dto";
import { paymentView } from "../dto/reservation.dto";
import { reservationConfigView, type ReservationConfigDto } from "../dto/reservation-config.dto";

export class GetReservationConfigUseCase {
  execute(): ReservationConfigDto {
    return reservationConfigView();
  }
}

export class CreateReservationUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly payments: ReservationPaymentRepository, private readonly settings: PaymentSettingsRepository, private readonly qr: VietQrGenerator, private readonly unitOfWork: UnitOfWork, private readonly clock: Clock, private readonly ids: IdGenerator, private readonly frontendUrl: string) {}

  async execute(input: CreateReservationCommand): Promise<CreateReservationResult> {
    this.validate(input);
    const settings = await this.settings.getActive();
    if (!settings) throw new ConflictError("Payment settings are not configured");
    const transactionRef = `RES_${this.ids.next().replace(/-/g, "")}`;
    const expiresAt = new Date(this.clock.now().getTime() + RESERVATION_CONFIG.paymentExpiryMinutes * 60_000);
    const transferContent = `ITSU ${transactionRef}`;
    const qrImageUrl = this.qr.generate(settings, calculateDeposit(input.seatCodes.length), transferContent);
    let reservation!: ReservationEntity;
    let payment!: Awaited<ReturnType<ReservationPaymentRepository["create"]>>;
    try {
      await this.unitOfWork.execute(async (context) => {
        const now = this.clock.now();
        const [legacySeats, heldSeats] = await Promise.all([this.reservations.findOccupiedSeats(input.reservationDate, input.session, input.slotId, now), this.holds.findOccupiedSeats(input.reservationDate, input.session, input.slotId, now)]);
        if (input.seatCodes.some((seat) => legacySeats.includes(seat) || heldSeats.includes(seat))) throw new ConflictError("One or more selected seats are no longer available");
        reservation = await this.reservations.create({ ...input, transactionReference: transactionRef, paymentExpiredAt: expiresAt, status: "PENDING_PAYMENT" }, context);
        payment = await this.payments.create({ reservationId: reservation.id, method: "VIETQR", amount: calculateDeposit(input.seatCodes.length), transactionReference: transactionRef, transferContent, status: "PENDING", bankCode: settings.bankCode, bankName: settings.bankName, accountNumber: settings.accountNumber, accountName: settings.accountName, qrTemplate: settings.qrTemplate, qrImageUrl }, context);
        await this.holds.createMany(input.seatCodes.map((seatCode) => ({ reservationId: reservation.id, reservationDate: input.reservationDate, session: input.session, slotId: input.slotId, seatCode, status: "HELD" as const, expiresAt })), context);
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000) throw new ConflictError("One or more selected seats are no longer available");
      throw error;
    }
    return { reservation, reservationId: reservation.id, transactionRef, paymentUrl: `${this.frontendUrl}/reservation-payment?reservationId=${reservation.id}`, payment: paymentView(payment, expiresAt) };
  }

  private validate(input: CreateReservationCommand) {
    const calculated = calculateDeposit(input.seatCodes.length);
    if (input.totalDeposit !== calculated) throw new BadRequestError(`Invalid deposit amount. Expected ${calculated} VND`);
    if (input.seatCodes.length < 1 || input.seatCodes.length > RESERVATION_CONFIG.maxSeatsPerReservation) throw new BadRequestError("Invalid number of seats");
    if (new Set(input.seatCodes).size !== input.seatCodes.length) throw new BadRequestError("Duplicate seats are not allowed");
    const validSeats = new Set(SEATS.map((seat) => seat.code)); const invalid = input.seatCodes.find((seat) => !validSeats.has(seat)); if (invalid) throw new BadRequestError(`Invalid seat code: ${invalid}`);
    const parts = input.reservationDate.split("-").map(Number); const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); if (parts.length !== 3 || date.getUTCFullYear() !== parts[0] || date.getUTCMonth() !== parts[1] - 1 || date.getUTCDate() !== parts[2]) throw new BadRequestError("Reservation date is invalid");
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(this.clock.now()); if (input.reservationDate < today) throw new BadRequestError("Reservation date cannot be in the past");
    const session = getSessionById(input.session); if (!session?.slots.some((slot) => slot.id === input.slotId)) throw new BadRequestError("Session and time slot do not match");
  }
}

export class GetOccupiedSeatsUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly clock: Clock) {}
  async execute(date: string, session: string, slotId: string) {
    const normalizedSession = session === "lunch" || session === "dinner" ? session as ReservationSession : null;
    if (!normalizedSession || !getSessionById(normalizedSession)?.slots.some((slot) => slot.id === slotId)) throw new BadRequestError("Session and time slot do not match");
    const [a, b] = await Promise.all([this.reservations.findOccupiedSeats(date, normalizedSession, slotId, this.clock.now()), this.holds.findOccupiedSeats(date, normalizedSession, slotId, this.clock.now())]);
    return [...new Set([...a, ...b])];
  }
}

export class GetMyReservationsUseCase { constructor(private readonly reservations: ReservationRepository) {} execute(userId: string) { return this.reservations.findByUserId(userId); } }
export class GetAdminReservationsUseCase { constructor(private readonly reservations: ReservationRepository) {} execute() { return this.reservations.findAll(); } }

export class GetReservationPaymentUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly payments: ReservationPaymentRepository) {}
  async execute(id: string, requesterId: string, isAdmin: boolean) { const reservation = await this.reservations.findById(id); if (!reservation) throw new NotFoundError("Reservation not found"); if (!isAdmin && reservation.userId !== requesterId) throw new ForbiddenError("You cannot access this payment"); const payment = await this.payments.findByReservationId(id); if (!payment) throw new NotFoundError("Payment not found"); return { reservation, payment: paymentView(payment, reservation.status === "PENDING_APPROVAL" ? reservation.approvalExpiresAt : reservation.paymentExpiredAt) }; }
}

export class ConfirmCustomerPaymentUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly payments: ReservationPaymentRepository, private readonly unitOfWork: UnitOfWork, private readonly clock: Clock) {}
  async execute(id: string, userId: string) { const reservation = await this.reservations.findById(id); if (!reservation) throw new NotFoundError("Reservation not found"); if (reservation.userId !== userId) throw new ForbiddenError("You can only confirm your own payment"); if (reservation.status === "PENDING_APPROVAL") return this.getResult(id); if (reservation.status !== "PENDING_PAYMENT") throw new ConflictError("Reservation is not awaiting payment"); if (!reservation.paymentExpiredAt || reservation.paymentExpiredAt <= this.clock.now()) throw new ConflictError("Payment window has expired"); const approvalExpiresAt = new Date(this.clock.now().getTime() + 30 * 60_000); await this.unitOfWork.execute(async (context) => { const changed = await this.reservations.transition(id, "PENDING_PAYMENT", "PENDING_APPROVAL", context); if (!changed) throw new ConflictError("Reservation state changed"); const payment = await this.payments.findByReservationId(id); if (!payment || !await this.payments.transition(payment.id, "PENDING", "PENDING_APPROVAL", { customerMarkedPaidAt: this.clock.now() }, context)) throw new ConflictError("Payment state changed"); await this.holds.transitionByReservationId(id, "HELD", "PENDING_APPROVAL", approvalExpiresAt, context); }); return this.getResult(id); }
  private async getResult(id: string) { const reservation = await this.reservations.findById(id); const payment = await this.payments.findByReservationId(id); if (!reservation || !payment) throw new NotFoundError("Payment not found"); return { reservation, payment: paymentView(payment, reservation.approvalExpiresAt) }; }
}

export class ApproveManualPaymentUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly payments: ReservationPaymentRepository, private readonly unitOfWork: UnitOfWork, private readonly clock: Clock) {}
  async execute(id: string, adminId: string, receivedAmount: number, note?: string) { const reservation = await this.reservations.findById(id); if (!reservation) throw new NotFoundError("Reservation not found"); if (receivedAmount !== reservation.totalDeposit) throw new BadRequestError("Payment amount does not match reservation"); if (reservation.status !== "PENDING_APPROVAL") throw new ConflictError("Reservation is not awaiting approval"); if (!reservation.approvalExpiresAt || reservation.approvalExpiresAt <= this.clock.now()) throw new ConflictError("Payment approval window has expired"); const slot = getSessionById(reservation.session)?.slots.find((value) => value.id === reservation.slotId); if (!slot) throw new BadRequestError("Reservation slot is invalid"); const holdExpiry = new Date(`${reservation.reservationDate}T${slot.endTime}:00+07:00`); let updated!: ReservationEntity; await this.unitOfWork.execute(async (context) => { const changed = await this.reservations.transition(id, "PENDING_APPROVAL", "PAID", context); if (!changed) throw new ConflictError("Reservation state changed"); const payment = await this.payments.findByReservationId(id); if (!payment || !await this.payments.transition(payment.id, "PENDING_APPROVAL", "CONFIRMED", { confirmedBy: adminId, confirmedAt: this.clock.now(), adminNote: note }, context)) throw new ConflictError("Payment state changed"); await this.holds.transitionByReservationId(id, "PENDING_APPROVAL", "CONFIRMED", holdExpiry, context); updated = changed; }); return updated; }
}

export class RejectManualPaymentUseCase { constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly payments: ReservationPaymentRepository, private readonly unitOfWork: UnitOfWork, private readonly clock: Clock) {} async execute(id: string, note?: string) { const reservation = await this.reservations.findById(id); if (!reservation) throw new NotFoundError("Reservation not found"); await this.unitOfWork.execute(async (context) => { const changed = await this.reservations.transition(id, "PENDING_APPROVAL", "CANCELLED", context); if (!changed) throw new ConflictError("Reservation state changed"); const payment = await this.payments.findByReservationId(id); if (payment) await this.payments.transition(payment.id, "PENDING_APPROVAL", "REJECTED", { adminNote: note }, context); await this.holds.releaseByReservationId(id, context); }); return this.reservations.findById(id); } }

export class UpdateReservationStatusUseCase {
  constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository, private readonly unitOfWork: UnitOfWork) {}
  async execute(id: string, status: ReservationStatus) {
    if (status === "PAID" || status === "PENDING_APPROVAL" || status === "PENDING_PAYMENT") throw new BadRequestError("Use the payment workflow to change payment status");
    let result!: ReservationEntity;
    await this.unitOfWork.execute(async (context) => {
      const updated = await this.reservations.updateStatus(id, status, context);
      if (!updated) throw new NotFoundError("Reservation not found");
      if (status === "CANCELLED" || status === "COMPLETED") await this.holds.releaseByReservationId(id, context);
      result = updated;
    });
    return result;
  }
}
export class DeleteReservationUseCase { constructor(private readonly reservations: ReservationRepository, private readonly holds: ReservationSeatHoldRepository) {} async execute(id: string) { const reservation = await this.reservations.findById(id); if (!reservation) throw new NotFoundError("Reservation not found"); await this.holds.releaseByReservationId(id); await this.reservations.delete(id); } }
