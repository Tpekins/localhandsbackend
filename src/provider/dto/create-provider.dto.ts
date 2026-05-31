import { IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProviderDto {
  @IsInt({ message: 'User ID must be an integer and is required.' })
  userId!: number;
}

export class UpdateProviderDto extends PartialType(CreateProviderDto) {}
