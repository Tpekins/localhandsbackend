import { IsInt, IsDate, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAvailabilityDto {
  @IsInt({ message: 'Provider ID must be an integer and is required.' })
  providerId: number;

  @IsInt({
    message:
      'Day of the week must be an integer between 0 (Sunday) and 6 (Saturday).',
  })
  @Min(0, { message: 'Day of the week cannot be less than 0 (Sunday).' })
  @Max(6, { message: 'Day of the week cannot be greater than 6 (Saturday).' })
  dayOfWeek: number;

  @IsDate({ message: 'Start time must be a valid date and is required.' })
  startTime: Date;

  @IsDate({ message: 'End time must be a valid date and is required.' })
  endTime: Date;
}

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {}
