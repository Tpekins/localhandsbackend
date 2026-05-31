import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PaymentMethod, PaymentStatus, Prisma } from '../../generated/client';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto implements Prisma.PaymentUncheckedCreateInput {
  @ApiProperty({ description: 'Contract ID', example: 1 })
  @IsNumber({}, { message: 'Contract ID must be a number' })
  @IsPositive({ message: 'Contract ID must be positive' })
  contractId!: number;

  @ApiProperty({ description: 'Payment amount in XAF', example: 1000 })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  @Min(100, { message: 'Amount must be greater than or equal to 100 XAF' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount!: number;

  @IsString({ message: 'Payment method is required' })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be mobile money',
  })
  paymentMethod!: PaymentMethod;

  @IsString({ message: 'Transaction ID is required' })
  @IsNotEmpty({ message: 'Transaction ID is required' })
  transactionId!: string;

  @IsString({ message: 'Status is required' })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(PaymentStatus, {
    message:
      'Status must be one of: ' + Object.values(PaymentStatus).join(', '),
  })
  status!: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(
  OmitType(CreatePaymentDto, ['contractId'] as const),
) {}
