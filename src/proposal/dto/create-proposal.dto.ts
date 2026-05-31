import { IsInt, IsString, IsPositive, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProposalDto {
  @IsInt({ message: 'Provider ID must be an integer and is required.' })
  providerId!: number;

  @IsInt({ message: 'Service ID must be an integer and is required.' })
  serviceId!: number;

  @IsString({ message: 'Cover letter must be a string and is required.' })
  @Length(10, 1000, {
    message: 'Cover letter must be between 10 and 1000 characters.',
  })
  coverLetter!: string;

  @IsPositive({
    message: 'Bid amount must be a positive number and is required.',
  })
  bidAmount!: number;
}

export class UpdateProposalDto extends PartialType(CreateProposalDto) {}
