import { Schema, model } from "mongoose";
import { ReservationDocument } from "./reservation.types";
import { ReservationStatus } from "@shared/schemas/reservation.schema";

const ReservationSchema = new Schema<ReservationDocument>(
  {
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },

    seatCodes: [{ type: String, required: true }], // Seat Codes Collection
    reservationDate: { type: String, required: true },
    timeSlot: { type: String, required: true },

    totalDeposit: { type: Number, required: true },

    vnp_TxnRef: { type: String, required: true , unique: true },
    status: {
      type: String,
      enum: ReservationStatus,
      default: "PENDING_PAYMENT",
    },
    // notes: { type: String },
  },
  { timestamps: true },
);

export const ReservationModel = model("Reservation", ReservationSchema);