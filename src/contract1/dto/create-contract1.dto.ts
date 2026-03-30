import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ContractStatus } from '@prisma/client';

export class CreateContract1Dto {
  @IsInt({ message: 'Service Order ID must be an integer and is required.' })
  serviceOrderId: number;

  @IsPositive({
    message: 'Escrow amount must be a positive number and is required.',
  })
  escrowAmount: number;

  @IsOptional()
  @IsInt({ message: 'Status must be an integer if provided.' })
  status?: ContractStatus; // Assuming status is an enum in your Prisma schema
  // You can also use @IsEnum(ContractStatus) if you have an enum defined in your code
}

export class UpdateContract1Dto extends PartialType(CreateContract1Dto) {}
