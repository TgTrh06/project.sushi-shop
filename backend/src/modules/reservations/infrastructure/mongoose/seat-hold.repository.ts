import { Types, type Model } from "mongoose";
import { SeatHoldModel, type SeatHoldDocument } from "./seat-hold.model";
import { sessionOf } from "@/core/transactions/mongoose-unit-of-work";
import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { ReservationSeatHoldRepository } from "../../domain/ports/seat-hold-repository.port";
import type { SeatHoldEntity, SeatHoldStatus } from "../../domain/entities/seat-hold.entity";
import type { ReservationSession } from "../../domain/entities/reservation.entity";

export class MongooseSeatHoldRepository implements ReservationSeatHoldRepository {
  constructor(private readonly model: Model<SeatHoldDocument> = SeatHoldModel) {}
  async createMany(holds: SeatHoldEntity[], context: TransactionContext) { await this.model.deleteMany({ expiresAt: { $lte: new Date() } }, { session: sessionOf(context) }); await this.model.insertMany(holds.map((hold) => ({ ...hold, reservationId: new Types.ObjectId(hold.reservationId) })), { session: sessionOf(context), ordered: true }); }
  async transitionByReservationId(reservationId: string, expected: SeatHoldStatus, next: SeatHoldStatus, expiresAt: Date, context: TransactionContext) { await this.model.updateMany({ reservationId: new Types.ObjectId(reservationId), status: expected }, { $set: { status: next, expiresAt } }, { session: sessionOf(context) }); }
  async releaseByReservationId(reservationId: string, context?: TransactionContext) { await this.model.deleteMany({ reservationId: new Types.ObjectId(reservationId) }, { session: sessionOf(context) }); }
  async findOccupiedSeats(date: string, session: ReservationSession, slotId: string, now: Date) { const docs = await this.model.find({ reservationDate: date, session, slotId, expiresAt: { $gt: now } }).select("seatCode").lean(); return docs.map((doc) => doc.seatCode); }
}
