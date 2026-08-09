import type { ClientSession } from "mongoose";
import { ReservationModel } from "./reservation.model";
import { ReservationEntity, CreateReservationDTO } from "./reservation.types";

export default class ReservationRepository {
  protected mapToEntity(doc: any): ReservationEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId?.toString(),
      customerName: doc.customerName,
      customerPhone: doc.customerPhone,
      reservationDate: doc.reservationDate,
      session: doc.session,
      slotId: doc.slotId,
      seatCodes: doc.seatCodes,
      totalDeposit: doc.totalDeposit,
      vnp_TxnRef: doc.vnp_TxnRef,
      paymentExpiredAt: doc.paymentExpiredAt,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(
    data: CreateReservationDTO & { userId: string; vnp_TxnRef: string; status: string; paymentExpiredAt?: Date },
    session?: ClientSession,
  ): Promise<ReservationEntity> {
    const doc = await new ReservationModel(data).save({ session });
    return this.mapToEntity(doc);
  }

  async findByTxnRef(txnRef: string): Promise<ReservationEntity | null> {
    const doc = await ReservationModel.findOne({ vnp_TxnRef: txnRef }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async updateStatus(
    txnRef: string,
    expectedStatus: string,
    status: string,
    session?: ClientSession,
  ): Promise<ReservationEntity | null> {
    const doc = await ReservationModel.findOneAndUpdate(
      { vnp_TxnRef: txnRef, status: expectedStatus },
      { $set: { status } },
      { returnDocument: "after", session, runValidators: true },
    ).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<ReservationEntity[]> {
    const docs = await ReservationModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findByUserId(userId: string): Promise<ReservationEntity[]> {
    const docs = await ReservationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    const doc = await ReservationModel.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async updateById(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity | null> {
    const doc = await ReservationModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true },
    ).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await ReservationModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]> {
    const now = new Date();
    const reservations = await ReservationModel.find({
      reservationDate: date,
      session,
      slotId,
      $or: [
        { status: "PAID" },
        { status: "PENDING_PAYMENT", paymentExpiredAt: { $gt: now } },
      ],
    }).select("seatCodes").lean();

    return reservations.flatMap((reservation) => reservation.seatCodes);
  }
}
