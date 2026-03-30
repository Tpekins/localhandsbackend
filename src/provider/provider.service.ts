import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProviderDto: CreateProviderDto) {
    // Assumes createProviderDto contains userId
    return this.prisma.provider.create({
      data: {
        userId: createProviderDto.userId,
        // Add other fields if needed
      },
    });
  }

  async findAll() {
    return this.prisma.provider.findMany({
      include: {
        user: true,
        services: true,
        availability: true,
      },
    });
  }

  async findOne(id: number) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        user: true,
        services: true,
        availability: true,
      },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }
    return provider;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    // Optionally check existence first
    await this.findOne(id);
    return this.prisma.provider.update({
      where: { id },
      data: { ...updateProviderDto },
    });
  }

  async remove(id: number) {
    // Optionally check existence first
    await this.findOne(id);
    return this.prisma.provider.delete({
      where: { id },
    });
  }
}
