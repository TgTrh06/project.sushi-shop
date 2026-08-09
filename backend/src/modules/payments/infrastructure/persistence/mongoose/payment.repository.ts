import { Types, type Model } from "mongoose";
import { PaymentSettingsModel, ReservationPaymentModel, type PaymentSettingsDocument, type ReservationPaymentDocument } from "./payment.model";
import { sessionOf } from "@/core/transactions/mongoose-unit-of-work";
import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { PaymentSettings, ReservationPayment, PaymentStatus } from "../../../domain/entities/payment.entity";
import type { PaymentSettingsRepository, ReservationPaymentRepository } from "../../../domain/ports/payment-repository.port";

export class MongoosePaymentSettingsRepository implements PaymentSettingsRepository {
  constructor(private readonly model: Model<PaymentSettingsDocument> = PaymentSettingsModel) {}
  private map(doc: Record<string, any>): PaymentSettings { return { id: String(doc._id), provider: "VIETQR", enabled: Boolean(doc.enabled), bankCode: doc.bankCode, bankName: doc.bankName, accountNumber: doc.accountNumber, accountName: doc.accountName, qrTemplate: doc.qrTemplate, paymentInstructions: doc.paymentInstructions, updatedBy: String(doc.updatedBy), createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) }; }
  async getActive() { const doc = await this.model.findOne({ enabled: true }).sort({ updatedAt: -1 }).lean(); return doc ? this.map(doc) : null; }
  async save(input: Omit<PaymentSettings, "id" | "createdAt" | "updatedAt">) { await this.model.updateMany({}, { $set: { enabled: false } }); const doc = await this.model.create(input); return this.map(doc); }
}

export class MongooseReservationPaymentRepository implements ReservationPaymentRepository {
  constructor(private readonly model: Model<ReservationPaymentDocument> = ReservationPaymentModel) {}
  private map(doc: Record<string, any>): ReservationPayment { return { id: String(doc._id), reservationId: String(doc.reservationId), method: "VIETQR", amount: doc.amount, transactionReference: doc.transactionReference, transferContent: doc.transferContent, status: doc.status, bankCode: doc.bankCode, bankName: doc.bankName, accountNumber: doc.accountNumber, accountName: doc.accountName, qrTemplate: doc.qrTemplate, qrImageUrl: doc.qrImageUrl, customerMarkedPaidAt: doc.customerMarkedPaidAt, confirmedBy: doc.confirmedBy ? String(doc.confirmedBy) : undefined, confirmedAt: doc.confirmedAt, adminNote: doc.adminNote, createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) }; }
  async create(input: Omit<ReservationPayment, "id" | "createdAt" | "updatedAt">, context: TransactionContext) { const docs = await this.model.create([{ ...input, reservationId: new Types.ObjectId(input.reservationId) }], { session: sessionOf(context) }); return this.map(docs[0]); }
  async findByReservationId(reservationId: string) { const doc = await this.model.findOne({ reservationId: new Types.ObjectId(reservationId) }).lean(); return doc ? this.map(doc) : null; }
  async transition(id: string, expected: PaymentStatus, next: PaymentStatus, patch: Partial<ReservationPayment>, context: TransactionContext) { const doc = await this.model.findOneAndUpdate({ _id: id, status: expected }, { $set: { ...patch, status: next, ...(patch.confirmedBy ? { confirmedBy: new Types.ObjectId(patch.confirmedBy as string) } : {}) } }, { new: true, runValidators: true, session: sessionOf(context) }).lean(); return doc ? this.map(doc) : null; }
}
