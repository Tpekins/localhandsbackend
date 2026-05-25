import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const { userId, bio, mobileMoneyNumber, bankAccountNumber, nationalIdUrl, location } = createProfileDto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) { throw new NotFoundException(`User with ID ${userId} not found`); }
    return this.prisma.profile.create({
      data: { userId, bio, mobileMoneyNumber, bankAccountNumber, nationalIdUrl, location, verificationStatus: VerificationStatus.PENDING },
      include: { user: true },
    });
  }

  async findAll() { return this.prisma.profile.findMany({ include: { user: true } }); }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id }, include: { user: true } });
    if (!profile) { throw new NotFoundException(`Profile with ID ${id} not found`); }
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) { throw new NotFoundException(`Profile with ID ${id} not found`); }
    return this.prisma.profile.update({ where: { id }, data: updateProfileDto, include: { user: true } });
  }

  async remove(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) { throw new NotFoundException(`Profile with ID ${id} not found`); }
    return this.prisma.profile.delete({ where: { id } });
  }
}
