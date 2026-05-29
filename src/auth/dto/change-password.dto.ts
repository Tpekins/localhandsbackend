import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword456' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}
