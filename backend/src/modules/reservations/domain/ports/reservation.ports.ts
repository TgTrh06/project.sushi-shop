import type { ClientSession } from "mongoose";
import type { ReservationEntity, CreateReservationDTO } from "../../reservation.types";

export interface ReservationRepositoryPort {
  create(
    data: CreateReservationDTO & {
      userId: string;
      vnp_TxnRef: string;
      status: string;
      paymentExpiredAt?: Date;
    },
    session?: ClientSession,
  ): Promise<ReservationEntity>;
  findByTxnRef(txnRef: string): Promise<ReservationEntity | null>;
  updateStatus(
    txnRef: string,
    expectedStatus: string,
    status: string,
    session?: ClientSession,
  ): Promise<ReservationEntity | null>;
  findAll(): Promise<ReservationEntity[]>;
  findByUserId(userId: string): Promise<ReservationEntity[]>;
  findById(id: string): Promise<ReservationEntity | null>;
  updateById(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity | null>;
  deleteById(id: string): Promise<boolean>;
  findOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]>;
}

export interface ReservationSeatHoldPort {
  createMany(
    holds: Array<{
      reservationId: string;
      reservationDate: string;
      session: "lunch" | "dinner";
      slotId: string;
      seatCode: string;
      status: "HELD" | "CONFIRMED";
      expiresAt: Date;
    }>,
    session: ClientSession,
  ): Promise<void>;
  confirmByReservationId(reservationId: string, expiresAt: Date, session?: ClientSession): Promise<void>;
  releaseByReservationId(reservationId: string, session?: ClientSession): Promise<void>;
  findOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]>;
}
