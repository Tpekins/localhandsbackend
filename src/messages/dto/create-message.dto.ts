import { IsString, IsInt, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMessageDto {
  @IsInt({ message: 'Sender ID must be an integer and is required.' })
  senderId: number;

  @IsInt({ message: 'Receiver ID must be an integer and is required.' })
  receiverId: number;

  @IsString({ message: 'Content must be a string and is required.' })
  content: string;

  @IsOptional()
  @IsInt({ message: 'Contract ID must be an integer if provided.' })
  contractId?: number;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
