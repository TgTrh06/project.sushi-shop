import mongoose, { Schema, Document } from "mongoose";
import { ReservationStatus } from "@shared/schemas/reservation.schema";

const ReservationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    seatIds: [{ type: String, required: true }], // Lưu Seat Codes hoặc ObjectIds
    reservationDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    totalDeposit: { type: Number, required: true },
    status: {
      type: String,
      enum: ReservationStatus,
      default: "PENDING_PAYMENT",
    },
    vnp_TxnRef: { type: String, unique: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const ReservationModel = mongoose.model("Reservation", ReservationSchema);