import type { PaymentSettings } from "../entities/payment.entity";
export interface VietQrGenerator { generate(settings: PaymentSettings, amount: number, transferContent: string): string; }
