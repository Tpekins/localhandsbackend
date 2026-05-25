import { registerAs } from '@nestjs/config';

export const PaymentConfig = registerAs(
  'paymentGateway',
  (): PaymentConfig => ({
    apiUser: process.env.PAYMENT_API_USER || '',
    apiKey: process.env.PAYMENT_API_KEY || '',
    liveBaseUrl: process.env.PAYMENT_LIVE_BASE_URL || 'https://api.fapshi.com',
    sandboxBaseUrl:
      process.env.PAYMENT_SANDBOX_BASE_URL || 'https://sandbox.fapshi.com',
  }),
);

export interface PaymentConfig {
  apiUser: string;
  apiKey: string;
  liveBaseUrl: string;
  sandboxBaseUrl: string;
}
