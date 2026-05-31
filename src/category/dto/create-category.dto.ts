import { IsString, IsOptional, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string and is required.' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters.' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string if provided.' })
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
