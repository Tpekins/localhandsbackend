import { Injectable, Logger } from '@nestjs/common';
import {
  GeneratePaymentLinkDto,
  PaymentLinkResponseDto,
  PaymentStatusResponseDto,
  DirectPaymentDto,
  DirectPaymentResponseDto,
} from './dto/fapshi-payment.dto';
import { FapshiService } from './services/fapshi.service';
import type { FapshiWebhookPayload } from './services/fapshi.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '../generated/client';

@Injectable()
export class PaymentService {
  /**
   * Return all payments with contract, client, and provider info for admin view
   */
  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        contract: {
          include: {
            serviceOrder: {
              include: {
                client: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  /**
   * Initialize payment for a contract: fetch contract, prepare Fapshi payload, call Fapshi, create Payment record, return link
   */
  async initializePaymentForContract(
    contractId: number,
  ): Promise<{ paymentLink: string }> {
    if (!contractId) {
      throw new Error('Contract ID is required.');
    }
    // Fetch contract and related info
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        serviceOrder: {
          include: {
            client: true, // To get client email
          },
        },
      },
    });
    if (!contract) {
      throw new Error('Contract not found.');
    }
    // Optionally check contract status here (e.g. already paid)
    // Prepare Fapshi payload
    const paymentData = {
      amount: contract.escrowAmount,
      email: contract.serviceOrder?.client?.email,
      externalId: `contract-${contract.id}-${Date.now()}`,
      redirectUrl: `https://yourapp.com/payment/verify?contractId=${contractId}`,
      message: `Payment for contract #${contract.id}`,
    };
    // Call Fapshi
    let fapshiResponse;
    // eslint-disable-next-line no-useless-catch
    try {
      fapshiResponse = await this.fapshiService.generateLink(paymentData);
    } catch (err) {
      throw err;
    }

    const paymentLink = fapshiResponse.link;
    if (!paymentLink) {
      throw new Error('Failed to retrieve payment link from Fapshi.');
    }
    // Create payment record
    await this.prisma.payment.create({
      data: {
        contractId: contract.id,
        amount: contract.escrowAmount,
        status: 'PENDING',

        transactionId: fapshiResponse.transId,
        paymentMethod: 'MTN_MOBILE_MONEY', // Or 'FAPSHI' if you have an enum value
      },
    });
    return { paymentLink };
  }
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly fapshiService: FapshiService,
    private readonly prisma: PrismaService,
  ) {}

  async updatePaymentStatus(id: number, status: PaymentStatus) {
    return this.prisma.payment.update({ where: { id }, data: { status } });
  }

  async generateLink(
    dto: GeneratePaymentLinkDto,
  ): Promise<PaymentLinkResponseDto> {
    if (dto.amount < 100) throw new Error('Amount must be >= 100');
    // Ensure externalId is string for FapshiService
    const req = { ...dto, externalId: String(dto.externalId) };
    return this.fapshiService.generateLink(req);
  }

  async getStatus(transId: string): Promise<PaymentStatusResponseDto> {
    if (!transId) throw new Error('Transaction ID required');
    const status = await this.fapshiService.getPaymentStatus(transId);
    // Add dummy amount for compatibility if missing
    return { ...status, amount: 0 } as PaymentStatusResponseDto;
  }

  async expire(transId: string): Promise<PaymentStatusResponseDto> {
    if (!transId) throw new Error('Transaction ID required');
    const expired = await this.fapshiService.expirePayment(transId);
    // Add dummy amount for compatibility if missing
    return { ...expired, amount: 0 } as PaymentStatusResponseDto;
  }

  async directPay(dto: DirectPaymentDto): Promise<DirectPaymentResponseDto> {
    if (dto.amount < 100) throw new Error('Amount must be >= 100');
    if (!dto.phone) throw new Error('Phone is required');
    // Ensure externalId is string for FapshiService
    const req = { ...dto, externalId: String(dto.externalId) };
    return this.fapshiService.initiateDirectPayment(req);
  }

  handleWebhook(payload: FapshiWebhookPayload): void {
    this.fapshiService.handleWebhook(payload);
  }
}
