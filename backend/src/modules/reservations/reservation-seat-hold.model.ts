import { Schema, Types, model, type ClientSession } from "mongoose";

export type ReservationSeatHoldStatus = "HELD" | "CONFIRMED";

export interface ReservationSeatHoldDocument {
  reservationId: Types.ObjectId;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCode: string;
  status: ReservationSeatHoldStatus;
  expiresAt: Date;
}

const ReservationSeatHoldSchema = new Schema<ReservationSeatHoldDocument>({
  reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
  reservationDate: { type: String, required: true },
  session: { type: String, enum: ["lunch", "dinner"], required: true },
  slotId: { type: String, required: true },
  seatCode: { type: String, required: true },
  status: { type: String, enum: ["HELD", "CONFIRMED"], required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

ReservationSeatHoldSchema.index(
  { reservationDate: 1, session: 1, slotId: 1, seatCode: 1 },
  { unique: true },
);
ReservationSeatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ReservationSeatHoldModel = model<ReservationSeatHoldDocument>(
  "ReservationSeatHold",
  ReservationSeatHoldSchema,
);

export interface SeatHoldInput {
  reservationId: string;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCode: string;
  status: ReservationSeatHoldStatus;
  expiresAt: Date;
}

export class ReservationSeatHoldRepository {
  async createMany(holds: SeatHoldInput[], session: ClientSession): Promise<void> {
    await ReservationSeatHoldModel.deleteMany(
      { expiresAt: { $lte: new Date() }, status: "HELD" },
      { session },
    );
    await ReservationSeatHoldModel.insertMany(
      holds.map((hold) => ({
        ...hold,
        reservationId: new Types.ObjectId(hold.reservationId),
      })),
      { session, ordered: true },
    );
  }

  async confirmByReservationId(
    reservationId: string,
    expiresAt: Date,
    session?: ClientSession,
  ): Promise<void> {
    await ReservationSeatHoldModel.updateMany(
      { reservationId: new Types.ObjectId(reservationId), status: "HELD" },
      { $set: { status: "CONFIRMED", expiresAt } },
      { session },
    );
  }

  async releaseByReservationId(
    reservationId: string,
    session?: ClientSession,
  ): Promise<void> {
    await ReservationSeatHoldModel.deleteMany(
      { reservationId: new Types.ObjectId(reservationId) },
      { session },
    );
  }

  async findOccupiedSeats(
    reservationDate: string,
    session: string,
    slotId: string,
    now = new Date(),
  ): Promise<string[]> {
    const holds = await ReservationSeatHoldModel.find({
      reservationDate,
      session,
      slotId,
      expiresAt: { $gt: now },
    }).select("seatCode").lean();

    return holds.map((hold) => hold.seatCode);
  }
}
