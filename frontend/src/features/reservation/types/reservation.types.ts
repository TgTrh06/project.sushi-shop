export type SessionType = "lunch" | "dinner";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
}

export interface SessionConfig {
  id: SessionType;
  label: string;
  slots: TimeSlot[];
}

export interface Seat {
  code: string;
  x: number;
  y: number;
  type: "counter" | "table";
}

export interface ReservationConfig {
  depositPerSeat: number;
  maxSeatsPerReservation: number;
  paymentExpiryMinutes: number;
  sessions: SessionConfig[];
  seats: Seat[];
}
