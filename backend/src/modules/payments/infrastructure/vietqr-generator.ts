import type { VietQrGenerator } from "../domain/ports/vietqr-generator.port";
import type { PaymentSettings } from "../domain/entities/payment.entity";

export class VietQrQuickLinkGenerator implements VietQrGenerator {
  generate(settings: PaymentSettings, amount: number, transferContent: string) {
    const base = `https://img.vietqr.io/image/${encodeURIComponent(settings.bankCode)}-${encodeURIComponent(settings.accountNumber)}-${encodeURIComponent(settings.qrTemplate)}.png`;
    const params = new URLSearchParams({ amount: String(amount), addInfo: transferContent, accountName: settings.accountName });
    return `${base}?${params.toString()}`;
  }
}
