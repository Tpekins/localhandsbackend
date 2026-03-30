import { IsBoolean, IsString, IsNumber, IsIn } from 'class-validator';

export class SystemSettingsDto {
  @IsBoolean()
  maintenance_mode: boolean;

  @IsBoolean()
  allow_registration: boolean;

  @IsBoolean()
  review_auto_approve: boolean;

  @IsString()
  @IsIn(['stripe', 'paypal'])
  payment_gateway: string;

  @IsBoolean()
  email_notifications: boolean;

  @IsNumber()
  max_file_size: number;

  @IsString()
  @IsIn(['USD', 'EUR', 'GBP'])
  currency: string;
}
