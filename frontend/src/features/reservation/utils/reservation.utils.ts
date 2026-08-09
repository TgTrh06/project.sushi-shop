export function calculateTotalDeposit(
  seatCount: number,
  depositPerSeat: number,
): number {
  return seatCount * depositPerSeat;
}
