import { Types, type Model } from "mongoose";
import { ReservationModel, type ReservationDocument } from "./reservation.model";
import { sessionOf } from "@/core/transactions/mongoose-unit-of-work";
import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { ReservationRepository } from "../../../domain/ports/reservation-repository.port";
import type { ReservationEntity, CreateReservationInput, ReservationSession, ReservationStatus } from "../../../domain/entities/reservation.entity";

export class MongooseReservationRepository implements ReservationRepository {
  constructor(private readonly model: Model<ReservationDocument> = ReservationModel) {}
  private map(doc: Record<string, any>): ReservationEntity { return { id: String(doc._id), userId: doc.userId ? String(doc.userId) : undefined, customerName: doc.customerName, customerPhone: doc.customerPhone, reservationDate: doc.reservationDate, session: doc.session, slotId: doc.slotId, seatCodes: doc.seatCodes, totalDeposit: doc.totalDeposit, transactionReference: doc.transactionReference ?? doc.vnp_TxnRef, paymentExpiredAt: doc.paymentExpiredAt, approvalExpiresAt: doc.approvalExpiresAt, status: doc.status, createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) }; }
  async create(input: CreateReservationInput, context: TransactionContext) { const doc = await this.model.create([{ ...input, userId: new Types.ObjectId(input.userId) }], { session: sessionOf(context) }); return this.map(doc[0]); }
  async findById(id: string) { const doc = await this.model.findById(id).lean(); return doc ? this.map(doc) : null; }
  async findByTransactionReference(reference: string) { const doc = await this.model.findOne({ $or: [{ transactionReference: reference }, { vnp_TxnRef: reference }] }).lean(); return doc ? this.map(doc) : null; }
  async findByUserId(userId: string) { const docs = await this.model.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean(); return docs.map((doc) => this.map(doc)); }
  async findAll() { const docs = await this.model.find().sort({ createdAt: -1 }).lean(); return docs.map((doc) => this.map(doc)); }
  async transition(id: string, expected: ReservationStatus, next: ReservationStatus, context: TransactionContext) { const doc = await this.model.findOneAndUpdate({ _id: id, status: expected }, { $set: { status: next } }, { returnDocument: "after", runValidators: true, session: sessionOf(context) }).lean(); return doc ? this.map(doc) : null; }
  async updateStatus(id: string, status: ReservationStatus, context: TransactionContext) { const doc = await this.model.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after", runValidators: true, session: sessionOf(context) }).lean(); return doc ? this.map(doc) : null; }
  async delete(id: string) { return (await this.model.findByIdAndDelete(id)) !== null; }
  async findOccupiedSeats(date: string, session: ReservationSession, slotId: string, now: Date) { const docs = await this.model.find({ reservationDate: date, session, slotId, status: { $in: ["PAID", "PENDING_PAYMENT", "PENDING_APPROVAL"] }, $or: [{ paymentExpiredAt: { $gt: now } }, { approvalExpiresAt: { $gt: now } }, { status: { $in: ["PAID"] } }] }).select("seatCodes").lean(); return docs.flatMap((doc) => doc.seatCodes); }
}
