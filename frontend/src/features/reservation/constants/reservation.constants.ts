export const RESERVATION_QUERY_KEYS = {
  config: ["reservation-config"],

  occupiedSeats: (
    date: string,
    session: string,
    slotId: string
  ) => [
    "occupied-seats",
    date,
    session,
    slotId,
  ],
};