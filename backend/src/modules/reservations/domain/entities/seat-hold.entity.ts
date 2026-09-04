import type { ReservationSession } from "./reservation.entity";

export type SeatHoldStatus = "HELD" | "PENDING_APPROVAL" | "CONFIRMED";
export interface SeatHoldEntity { id?: string; reservationId: string; reservationDate: string; session: ReservationSession; slotId: string; seatCode: string; status: SeatHoldStatus; expiresAt: Date; }
