export interface ConfigurePaymentSettingsInput { enabled: boolean; bankCode: string; bankName: string; accountNumber: string; accountName: string; qrTemplate: string; paymentInstructions: string; }
export interface ConfirmManualPaymentInput { receivedAmount: number; note?: string; }
