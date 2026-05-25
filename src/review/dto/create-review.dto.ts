import { IsInt, IsString, IsOptional, IsPositive, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateReviewDto {
  @IsInt({ message: 'Contract ID must be an integer and is required.' })
  contractId: number;

  @IsInt({ message: 'Reviewer ID must be an integer and is required.' })
  reviewerId: number;

  @IsPositive({ message: 'Rating must be a positive number and is required.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating cannot be greater than 5.' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string if provided.' })
  comment?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
