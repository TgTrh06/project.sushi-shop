import { Schema, model } from "mongoose";
import { ReservationDocument } from "./reservation.types";
import { ReservationStatus } from "@shared/schemas/reservation.schema";

const ReservationSchema = new Schema<ReservationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },

    reservationDate: { type: String, required: true }, // YYYY-MM-DD
    session: { type: String, enum: ["lunch", "dinner"], required: true },
    slotId: { type: String, required: true }, // e.g., "LUNCH_1", "DINNER_2"
    seatCodes: [{ type: String, required: true }], // e.g., ["C1", "C2"]

    totalDeposit: { type: Number, required: true },
    vnp_TxnRef: { type: String, required: true, unique: true },
    paymentExpiredAt: { type: Date, required: false },

    status: {
      type: String,
      enum: ReservationStatus,
      default: "PENDING_PAYMENT",
    },
  },
  { timestamps: true },
);

// Index for efficient occupied seat queries
ReservationSchema.index({ reservationDate: 1, session: 1, slotId: 1, status: 1 });

export const ReservationModel = model("Reservation", ReservationSchema);