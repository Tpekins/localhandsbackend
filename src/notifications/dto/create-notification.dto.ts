import { IsInt, IsString, IsBoolean, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNotificationDto {
  @IsInt({ message: 'User ID must be an integer and is required.' })
  userId!: number;

  @IsString({ message: 'Message must be a string and is required.' })
  @Length(1, 255, { message: 'Message must be between 1 and 255 characters.' })
  message!: string;

  @IsString({ message: 'Type must be a string and is required.' })
  type!: string;

  @IsBoolean({ message: 'Read must be a boolean value and is required.' })
  read!: boolean;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
