import { describe, expect, it } from "vitest";
import { calculateTotalDeposit } from "./reservation.utils";

describe("reservation pricing", () => {
  it("calculates deposit from the server-shared price", () => {
    expect(calculateTotalDeposit(3, 100000)).toBe(300000);
  });
});
