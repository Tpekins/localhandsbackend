import { PaymentStatus, PaymentMethod, Prisma } from '../../generated/client';

export class Payment implements Prisma.PaymentUncheckedCreateInput {
  id?: number;
  contractId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status?: PaymentStatus;
  createdAt?: Date | string;
}
