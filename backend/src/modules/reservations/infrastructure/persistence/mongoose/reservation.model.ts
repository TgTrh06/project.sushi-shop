import { Schema, model, type Document, Types } from "mongoose";
import type { ReservationStatus } from "../../../domain/entities/reservation.entity";

export interface ReservationDocument extends Document {
  userId?: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  transactionReference: string;
  vnp_TxnRef?: string;
  paymentExpiredAt?: Date;
  approvalExpiresAt?: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ReservationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, customerName: { type: String, required: true }, customerPhone: { type: String, required: true },
  reservationDate: { type: String, required: true }, session: { type: String, enum: ["lunch", "dinner"], required: true }, slotId: { type: String, required: true }, seatCodes: { type: [String], required: true }, totalDeposit: { type: Number, required: true },
  transactionReference: { type: String, required: true, unique: true, index: true }, vnp_TxnRef: { type: String, sparse: true }, paymentExpiredAt: Date, approvalExpiresAt: Date,
  status: { type: String, enum: ["PENDING_PAYMENT", "PENDING_APPROVAL", "PAID", "CANCELLED", "COMPLETED"], default: "PENDING_PAYMENT" },
}, { timestamps: true });
schema.index({ reservationDate: 1, session: 1, slotId: 1, status: 1 });
export const ReservationModel = model<ReservationDocument>("Reservation", schema);
