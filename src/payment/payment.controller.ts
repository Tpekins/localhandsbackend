/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentStatus } from '@prisma/client';
import {
  GeneratePaymentLinkDto,
  DirectPaymentDto,
} from './dto/fapshi-payment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update payment status by ID' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', new ParseEnumPipe(PaymentStatus)) status: PaymentStatus,
  ) {
    return this.paymentService.updatePaymentStatus(id, status);
  }

  // Fapshi API integration endpoints

  @Post('fapshi/payment-link')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate Fapshi payment link' })
  generatePaymentLink(@Body() generatePaymentLinkDto: GeneratePaymentLinkDto) {
    return this.paymentService.generateLink(generatePaymentLinkDto);
  }

  @Post('fapshi/direct-pay')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate direct Fapshi payment' })
  directPay(@Body() directPaymentDto: DirectPaymentDto) {
    return this.paymentService.directPay(directPaymentDto);
  }

  /**
   * Initialize payment for a contract (Fapshi payment link)
   * @param body { contractId: number }
   */
  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Initialize payment for a contract (by contractId in body) and get Fapshi payment link',
    description:
      'Provide a contractId in the request body to generate a payment link for that contract.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contractId: {
          type: 'number',
          example: 3,
          description: 'ID of the contract to pay for',
        },
      },
      required: ['contractId'],
    },
    description: 'Contract ID to initialize payment for.',
  })
  async initializePaymentForContract(@Body('contractId') contractId: number) {
    if (!contractId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Contract ID is required.',
      };
    }
    try {
      const result =
        await this.paymentService.initializePaymentForContract(contractId);
      return {
        message: 'Payment initialized successfully.',
        paymentLink: result.paymentLink,
      };
    } catch (error) {
      if (error?.response?.data) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to communicate with payment gateway.',

          details: error.response.data,
        };
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,

        message: error?.message || 'Internal Server Error',
      };
    }
  }

  /**
   * Alternative: Initialize Fapshi payment using contractId as a URL parameter
   */
  @Post('fapshi/payment-link/:contractId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Initialize Fapshi payment for a contract (by contractId in URL param)',
    description:
      'Call this endpoint with a contractId in the URL to generate a payment link for that contract.',
  })
  @ApiParam({
    name: 'contractId',
    type: Number,
    required: true,
    example: 3,
    description: 'ID of the contract to pay for.',
  })
  async initializeFapshiPayment(@Param('contractId') contractId: number) {
    if (!contractId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Contract ID is required.',
      };
    }
    try {
      const result = await this.paymentService.initializePaymentForContract(
        Number(contractId),
      );
      return {
        message: 'Payment initialized successfully.',
        paymentLink: result.paymentLink,
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response
      ) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to communicate with payment gateway.',
          details: (error as any).response.data,
        };
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as any)?.message || 'Internal Server Error',
      };
    }
  }

  /**
   * List all payments/transactions for admin view
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all payments/transactions (admin)' })
  async findAllPayments() {
    return await this.paymentService.findAll();
  }

  // Add more Fapshi-related endpoints as needed
}
