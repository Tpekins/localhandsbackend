import {
  IsInt,
  IsString,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServicepackageDto {
  @IsInt({ message: 'Provider ID must be an integer and is required.' })
  providerId!: number;

  @IsString({ message: 'Title must be a string and is required.' })
  @Length(3, 100, { message: 'Title must be between 3 and 100 characters.' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string if provided.' })
  @Length(0, 500, { message: 'Description must not exceed 500 characters.' })
  description?: string;

  @IsPositive({ message: 'Price must be a positive number and is required.' })
  price!: number;
}

export class UpdateServicepackageDto extends PartialType(
  CreateServicepackageDto,
) {}
