import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsIn,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    example: 'House Cleaning',
    description: 'Title of the service',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Title must be a string and is required.' })
  @Length(3, 100, { message: 'Title must be between 3 and 100 characters.' })
  title: string;

  @ApiProperty({
    example:
      'Professional house cleaning service including dusting, vacuuming, and bathroom cleaning',
    description: 'Detailed description of the service',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString({ message: 'Description must be a string and is required.' })
  @Length(10, 1000, {
    message: 'Description must be between 10 and 1000 characters.',
  })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Category ID of the service',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Category ID must be a number if provided.' })
  categoryId?: number;

  @ApiProperty({
    example: 50.0,
    description: 'Price of the service',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Price must be a number and is required.' })
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;

  @ApiProperty({
    example: 'available',
    description: 'Status of the service',
    enum: ['available', 'unavailable', 'archived'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string if provided.' })
  @IsIn(['available', 'unavailable', 'archived'], {
    message: 'Status must be one of "available", "unavailable", or "archived".',
  })
  status?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the service provider',
  })
  @IsNumber({}, { message: 'Provider ID must be a number and is required.' })
  providerId: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
