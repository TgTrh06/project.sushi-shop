import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { SeatHoldEntity, SeatHoldStatus } from "../entities/seat-hold.entity";
import type { ReservationSession } from "../entities/reservation.entity";

export interface ReservationSeatHoldRepository {
  createMany(holds: SeatHoldEntity[], context: TransactionContext): Promise<void>;
  transitionByReservationId(reservationId: string, expected: SeatHoldStatus, next: SeatHoldStatus, expiresAt: Date, context: TransactionContext): Promise<void>;
  releaseByReservationId(reservationId: string, context?: TransactionContext): Promise<void>;
  findOccupiedSeats(date: string, session: ReservationSession, slotId: string, now: Date): Promise<string[]>;
}
