import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ContractStatus } from '../../generated/client';

export class CreateContractDto {
  @IsInt({ message: 'Service Order ID must be an integer and is required.' })
  serviceOrderId!: number;

  @IsPositive({
    message: 'Escrow amount must be a positive number and is required.',
  })
  escrowAmount!: number;

  @IsOptional()
  @IsInt({ message: 'Status must be an integer if provided.' })
  status?: ContractStatus;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
