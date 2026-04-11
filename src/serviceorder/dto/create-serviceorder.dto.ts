import {
  IsInt,
  IsString,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceorderDto {
  @IsInt({ message: 'Service ID must be an integer and is required.' })
  serviceId: number;

  @IsInt({ message: 'Client ID must be an integer and is required.' })
  clientId: number;

  @IsString({ message: 'Description must be a string and is required.' })
  @Length(10, 500, {
    message: 'Description must be between 10 and 500 characters.',
  })
  description: string;

  @IsOptional()
  @IsPositive({ message: 'Budget must be a positive number if provided.' })
  budget?: number;
}

export class UpdateServiceorderDto extends PartialType(CreateServiceorderDto) {}
