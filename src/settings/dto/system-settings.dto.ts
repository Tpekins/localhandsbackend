import { IsBoolean, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SystemSettingsDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  maintenanceMode: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowRegistration: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  reviewAutoApprove: boolean;

  @ApiProperty({ example: 'fapshi' })
  @IsString()
  paymentGateway: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  emailNotifications: boolean;

  @ApiProperty({ example: 5 })
  @IsNumber()
  maxFileSize: number;

  @ApiProperty({ example: 'XAF' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'FCFA', required: false })
  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @ApiProperty({ example: 'support@localhands.com', required: false })
  @IsOptional()
  @IsString()
  supportEmail?: string;
}
