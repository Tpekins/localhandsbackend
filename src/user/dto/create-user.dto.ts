import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Name must be a string and is required.' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
  name: string;
  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    minLength: 10,
    maxLength: 15,
  })
  @IsString({ message: 'Phone number must be a string and is required.' })
  @Length(10, 15, {
    message: 'Phone number must be between 10 and 15 characters.',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail(
    {},
    { message: 'Email must be a valid email address and is required.' },
  )
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 8,
    maxLength: 100,
  })
  @IsString({ message: 'Password must be a string and is required.' })
  @Length(8, 100, { message: 'Password must be at least 8 characters long.' })
  @IsNotEmpty({ message: 'Password is required and cannot be empty.' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: 'USER',
    description: 'User role (PROVIDER, CLIENT, or ADMIN)',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role if provided.' })
  role?: UserRole;
}


