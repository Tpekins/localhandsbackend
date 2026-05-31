import { IsInt, IsDate, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBookingDto {
  @IsInt({ message: 'Service ID must be an integer and is required.' })
  serviceId!: number;

  @IsInt({ message: 'Client ID must be an integer and is required.' })
  clientId!: number;

  @IsDate({ message: 'Start time must be a valid date and is required.' })
  startTime!: Date;

  @IsDate({ message: 'End time must be a valid date and is required.' })
  endTime!: Date;

  @IsOptional()
  @IsString({ message: 'Location must be a string if provided.' })
  location?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
