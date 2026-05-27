import { IsBoolean, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SystemSettingsDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  maintenance_mode: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allow_registration: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  review_auto_approve: boolean;

  @ApiProperty({ example: 'fapshi' })
  @IsString()
  payment_gateway: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  email_notifications: boolean;

  @ApiProperty({ example: 5 })
  @IsNumber()
  max_file_size: number;

  @ApiProperty({ example: 'XAF' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'FCFA', required: false })
  @IsOptional()
  @IsString()
  currency_symbol?: string;

  @ApiProperty({ example: 'support@localhands.com', required: false })
  @IsOptional()
  @IsString()
  supportEmail?: string;
}
