import { BadRequestError, NotFoundError } from "@/core/errors";
import type { PaymentSettingsRepository } from "../../domain/ports/payment-repository.port";
import type { ConfigurePaymentSettingsInput } from "../dto/payment.dto";

export class GetPaymentSettingsUseCase { constructor(private readonly settings: PaymentSettingsRepository) {} async execute() { return this.settings.getActive(); } }
export class ConfigurePaymentSettingsUseCase {
  constructor(private readonly settings: PaymentSettingsRepository) {}
  async execute(input: ConfigurePaymentSettingsInput, adminId: string) { if (input.enabled && (!input.bankCode || !input.accountNumber || !input.accountName)) throw new BadRequestError("Bank information is required"); return this.settings.save({ ...input, provider: "VIETQR", updatedBy: adminId }); }
}
