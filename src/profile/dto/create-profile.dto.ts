import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user this profile belongs to',
  })
  @IsInt({ message: 'User ID must be an integer and is required.' })
  userId: number;

  @ApiProperty({
    example: 'I am a professional service provider',
    description: 'User biography',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string if provided.' })
  @Length(0, 500, { message: 'Bio must not exceed 500 characters.' })
  bio?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Mobile money account number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mobile money number must be a string if provided.' })
  mobileMoneyNumber?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Bank account number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bank account number must be a string if provided.' })
  bankAccountNumber?: string;

  @ApiProperty({
    example: 'https://example.com/id.jpg',
    description: 'URL to the national ID document',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'National ID URL must be a string if provided.' })
  nationalIdUrl?: string;

  @ApiProperty({
    example: 'New York, NY',
    description: 'User location',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string if provided.' })
  location?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
