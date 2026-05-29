import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    let user: User;
    try {
      if (identifier.includes('@')) {
        user = await this.usersService.findByEmail(identifier);
      } else {
        user = await this.usersService.findByPhoneNumber(identifier);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Omit<User, 'passwordHash'> }> {
    const { identifier, password } = loginDto;

    const validatedUser = await this.validateUser(identifier, password);
    if (!validatedUser) {
      throw new ForbiddenException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(validatedUser.id);

    const payload = {
      email: validatedUser.email,
      phoneNumber: validatedUser.phoneNumber,
      sub: validatedUser.id,
      name: validatedUser.name,
      role: validatedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: validatedUser,
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findOneWithPassword(userId);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { passwordHash } as any);

    return { message: 'Password changed successfully' };
  }
}
