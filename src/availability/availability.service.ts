import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvailabilityDto: CreateAvailabilityDto) {
    const { providerId, dayOfWeek, startTime, endTime } = createAvailabilityDto;

    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    return this.prisma.availability.create({
      data: {
        providerId,
        dayOfWeek,
        startTime,
        endTime,
      },
    });
  }

  async findAll() {
    return this.prisma.availability.findMany({
      include: {
        provider: true,
      },
    });
  }

  async findOne(id: number) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
    return availability;
  }

  async update(id: number, updateAvailabilityDto: UpdateAvailabilityDto) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }

    return this.prisma.availability.update({
      where: { id },
      data: updateAvailabilityDto,
    });
  }

  async remove(id: number) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }

    return this.prisma.availability.delete({
      where: { id },
    });
  }
}
