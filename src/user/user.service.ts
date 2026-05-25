import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, phoneNumber, email, role } = createUserDto;

    // Check if a user with the same phone number or email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this phone number or email already exists.',
      );
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name,
        phoneNumber,
        email,
        passwordHash,
        role,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        role: true,
        profile: {
          omit: {
            bankAccountNumber: true,
            nationalIdUrl: true,
          },
        },
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true, // Include the user's profile in the response
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true, // Include the user's profile in the response
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (!user) {
      throw new NotFoundException(
        `User with phone number ${phoneNumber} not found`,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user's profile first (if it exists)
    await this.prisma.profile.delete({
      where: { userId: id },
    });

    // Delete the user
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async userExists(phoneNumber: string, email: string): Promise<boolean> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
    });
    return !!existingUser; // Return true if a user exists, false otherwise
  }
}
