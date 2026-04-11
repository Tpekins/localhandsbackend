import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicepackageDto } from './dto/create-servicepackage.dto';
import { UpdateServicepackageDto } from './dto/update-servicepackage.dto';

@Injectable()
export class ServicepackageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServicepackageDto: CreateServicepackageDto) {
    const { providerId, title, description, price } = createServicepackageDto;

    // Ensure the provider exists
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    // Create the service package
    return this.prisma.servicePackage.create({
      data: {
        providerId,
        title,
        description,
        price,
      },
    });
  }

  async findAll() {
    return this.prisma.servicePackage.findMany({
      include: {
        provider: true, // Include provider details
        services: true, // Include associated services
      },
    });
  }

  async findOne(id: number) {
    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id },
      include: {
        provider: true, // Include provider details
        services: true, // Include associated services
      },
    });
    if (!servicePackage) {
      throw new NotFoundException(`Service package with ID ${id} not found`);
    }
    return servicePackage;
  }

  async update(id: number, updateServicepackageDto: UpdateServicepackageDto) {
    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id },
    });
    if (!servicePackage) {
      throw new NotFoundException(`Service package with ID ${id} not found`);
    }

    return this.prisma.servicePackage.update({
      where: { id },
      data: updateServicepackageDto,
    });
  }

  async remove(id: number) {
    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id },
    });
    if (!servicePackage) {
      throw new NotFoundException(`Service package with ID ${id} not found`);
    }

    return this.prisma.servicePackage.delete({
      where: { id },
    });
  }

  /**
   * Retrieve all services associated with a specific service package.
   */
  async findServicesByPackage(packageId: number) {
    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id: packageId },
      include: {
        services: true, // Include associated services
      },
    });
    if (!servicePackage) {
      throw new NotFoundException(
        `Service package with ID ${packageId} not found`,
      );
    }
    return servicePackage.services;
  }
}
