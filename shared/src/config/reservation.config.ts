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

export const RESERVATION_CONFIG = {
  depositPerSeat: 100000, // VND per seat
  paymentExpiryMinutes: 15, // Payment must be completed within 15 minutes

  sessions: [
    {
      id: "lunch" as SessionType,
      label: "Lunch",
      slots: [
        {
          id: "LUNCH_1",
          startTime: "11:30",
          endTime: "13:00",
          label: "11:30 - 13:00",
        },
        {
          id: "LUNCH_2",
          startTime: "13:15",
          endTime: "14:45",
          label: "13:15 - 14:45",
        },
      ],
    },
    {
      id: "dinner" as SessionType,
      label: "Dinner",
      slots: [
        {
          id: "DINNER_1",
          startTime: "17:00",
          endTime: "19:00",
          label: "17:00 - 19:00",
        },
        {
          id: "DINNER_2",
          startTime: "19:15",
          endTime: "21:15",
          label: "19:15 - 21:15",
        },
        {
          id: "DINNER_3",
          startTime: "21:30",
          endTime: "23:30",
          label: "21:30 - 23:30",
        },
      ],
    },
  ] as SessionConfig[],
};

// Helper functions
export function getSessionById(sessionId: SessionType): SessionConfig | undefined {
  return RESERVATION_CONFIG.sessions.find((s) => s.id === sessionId);
}

export function getSlotById(slotId: string): TimeSlot | undefined {
  for (const session of RESERVATION_CONFIG.sessions) {
    const slot = session.slots.find((s) => s.id === slotId);
    if (slot) return slot;
  }
  return undefined;
}

export function calculateDeposit(seatCount: number): number {
  return seatCount * RESERVATION_CONFIG.depositPerSeat;
}