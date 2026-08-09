import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { ReservationEntity, CreateReservationInput, ReservationSession, ReservationStatus } from "../entities/reservation.entity";

export interface ReservationRepository {
  create(input: CreateReservationInput, context: TransactionContext): Promise<ReservationEntity>;
  findById(id: string): Promise<ReservationEntity | null>;
  findByTransactionReference(reference: string): Promise<ReservationEntity | null>;
  findByUserId(userId: string): Promise<ReservationEntity[]>;
  findAll(): Promise<ReservationEntity[]>;
  transition(id: string, expected: ReservationStatus, next: ReservationStatus, context: TransactionContext): Promise<ReservationEntity | null>;
  updateStatus(id: string, status: ReservationStatus, context: TransactionContext): Promise<ReservationEntity | null>;
  delete(id: string): Promise<boolean>;
  findOccupiedSeats(date: string, session: ReservationSession, slotId: string, now: Date): Promise<string[]>;
}
