import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfile1Dto } from './dto/create-profile1.dto';
import { UpdateProfile1Dto } from './dto/update-profile1.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class Profile1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfile1Dto: CreateProfile1Dto) {
    const {
      userId,
      bio,
      mobileMoneyNumber,
      bankAccountNumber,
      nationalIdUrl,
      location,
    } = createProfile1Dto;

    // Ensure the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create the profile
    return this.prisma.profile.create({
      data: {
        userId,
        bio,
        mobileMoneyNumber,
        bankAccountNumber,
        nationalIdUrl,
        location,
        verificationStatus: VerificationStatus.PENDING, // Default verification status
      },
      include: {
        user: true, // Include user details in response
      },
    });
  }

  async findAll() {
    return this.prisma.profile.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(id: number, updateProfile1Dto: UpdateProfile1Dto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfile1Dto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
