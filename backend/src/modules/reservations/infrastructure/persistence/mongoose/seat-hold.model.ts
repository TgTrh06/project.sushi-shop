import { Schema, model, type Document, Types } from "mongoose";
import type { SeatHoldStatus } from "../../../domain/entities/seat-hold.entity";

export interface SeatHoldDocument extends Document { reservationId: Types.ObjectId; reservationDate: string; session: "lunch" | "dinner"; slotId: string; seatCode: string; status: SeatHoldStatus; expiresAt: Date; }
const schema = new Schema<SeatHoldDocument>({ reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true }, reservationDate: { type: String, required: true }, session: { type: String, enum: ["lunch", "dinner"], required: true }, slotId: { type: String, required: true }, seatCode: { type: String, required: true }, status: { type: String, enum: ["HELD", "PENDING_APPROVAL", "CONFIRMED"], required: true }, expiresAt: { type: Date, required: true } }, { timestamps: true });
schema.index({ reservationDate: 1, session: 1, slotId: 1, seatCode: 1 }, { unique: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const SeatHoldModel = model<SeatHoldDocument>("ReservationSeatHold", schema);
