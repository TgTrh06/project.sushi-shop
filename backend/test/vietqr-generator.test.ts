import { describe, expect, it } from "vitest";
import { VietQrQuickLinkGenerator } from "@/modules/payments/infrastructure/vietqr-generator";

describe("VietQrQuickLinkGenerator", () => {
  it("generates a deterministic QR URL from server-owned payment settings", () => {
    const url = new VietQrQuickLinkGenerator().generate({ id: "1", provider: "VIETQR", enabled: true, bankCode: "VCB", bankName: "Vietcombank", accountNumber: "0123456789", accountName: "ITSU SUSHI", qrTemplate: "compact2", paymentInstructions: "", updatedBy: "admin", createdAt: new Date(), updatedAt: new Date() }, 200000, "ITSU RES_123");
    expect(url).toContain("img.vietqr.io/image/VCB-0123456789-compact2.png");
    expect(url).toContain("amount=200000");
    expect(url).toContain("ITSU+RES_123");
  });
});
