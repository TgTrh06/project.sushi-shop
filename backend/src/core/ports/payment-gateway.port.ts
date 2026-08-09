export interface PaymentRequest {
  amount: number;
  transactionReference: string;
  returnUrl: string;
  ipAddress: string;
  orderInfo: string;
  expiresAt: Date;
}

export interface PaymentCallback {
  transactionReference: string;
  amount: number;
  responseCode: string;
  isVerified: boolean;
}

export interface PaymentGateway {
  createPaymentUrl(request: PaymentRequest): string;
  verifyCallback(query: Record<string, unknown>): PaymentCallback;
}
