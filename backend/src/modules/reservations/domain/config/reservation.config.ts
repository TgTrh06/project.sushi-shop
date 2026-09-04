export type ReservationSession = "lunch" | "dinner";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
}

export interface SessionConfig {
  id: ReservationSession;
  label: string;
  slots: TimeSlot[];
}

export const RESERVATION_CONFIG = {
  depositPerSeat: 100000,
  maxSeatsPerReservation: 8,
  paymentExpiryMinutes: 15,
  sessions: [
    {
      id: "lunch" as ReservationSession,
      label: "Lunch",
      slots: [
        { id: "LUNCH_1", startTime: "11:30", endTime: "13:00", label: "11:30 - 13:00" },
        { id: "LUNCH_2", startTime: "13:15", endTime: "14:45", label: "13:15 - 14:45" },
      ],
    },
    {
      id: "dinner" as ReservationSession,
      label: "Dinner",
      slots: [
        { id: "DINNER_1", startTime: "17:00", endTime: "19:00", label: "17:00 - 19:00" },
        { id: "DINNER_2", startTime: "19:15", endTime: "21:15", label: "19:15 - 21:15" },
        { id: "DINNER_3", startTime: "21:30", endTime: "23:30", label: "21:30 - 23:30" },
      ],
    },
  ] satisfies SessionConfig[],
};

export function getSessionById(sessionId: ReservationSession): SessionConfig | undefined {
  return RESERVATION_CONFIG.sessions.find((session) => session.id === sessionId);
}

export function calculateDeposit(seatCount: number): number {
  return seatCount * RESERVATION_CONFIG.depositPerSeat;
}
