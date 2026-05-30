import { IsInt, IsString, IsOptional, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AssetType } from '../../generated/client';

export class CreateServiceassetDto {
  @IsInt({ message: 'Service ID must be an integer and is required.' })
  serviceId: number;

  @IsString({ message: 'Type must be a string and is required.' })
  @IsIn(['IMAGE', 'AREA'], {
    message: 'Type must be either "IMAGE" or "AREA".',
  })
  type: AssetType;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string if provided.' })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: 'Caption must be a string if provided.' })
  caption?: string;

  @IsOptional()
  @IsString({ message: 'Area name must be a string if provided.' })
  areaName?: string;
}

export class UpdateServiceassetDto extends PartialType(CreateServiceassetDto) {}
