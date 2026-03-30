import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const { title, description, categoryId, price, status, providerId } =
      createServiceDto;

    // Ensure the provider exists
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    // Ensure the category exists (if provided)
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    // Create the service
    return this.prisma.service.create({
      data: {
        title,
        description,
        categoryId,
        price,
        status: status || 'available', // Default status
        providerId,
      },
    });
  }

  async findAll(filters?: {
    status?: string;
    categoryId?: string;
    providerId?: string;
  }) {
    const where: Prisma.ServiceWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.categoryId) {
      where.categoryId = Number(filters.categoryId);
    }

    if (filters?.providerId) {
      where.providerId = Number(filters.providerId);
    }

    return this.prisma.service.findMany({
      where,
      include: {
        category: true, // Include category details
        provider: true, // Include provider details
        serviceOrders: true, // Include associated service orders
        bookings: true, // Include associated bookings
        proposals: true, // Include associated proposals
        servicePackages: true, // Include associated service packages
        assets: true, // Include associated assets
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    // Validate the service ID
    this.validateServiceId(id);

    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true, // Include category details
        provider: true, // Include provider details
        serviceOrders: true, // Include associated service orders
        bookings: true, // Include associated bookings
        proposals: true, // Include associated proposals
        servicePackages: true, // Include associated service packages
        assets: true, // Include associated assets
      },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    // Check if the service exists
    await this.ensureServiceExists(id);

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: number) {
    // Check if the service exists
    await this.ensureServiceExists(id);

    return this.prisma.service.delete({
      where: { id },
    });
  }

  async findByProvider(providerId: number) {
    return this.findAll({ providerId: providerId.toString() });
  }

  async findByCategory(categoryId: number) {
    // Validate the category ID
    if (!categoryId || isNaN(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }

    // Ensure the category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Find all services in the category
    return this.prisma.service.findMany({
      where: { categoryId },
      include: {
        provider: true, // Include provider details
      },
    });
  }

  async updateStatus(id: number, status: string) {
    if (!['available', 'unavailable', 'archived'].includes(status)) {
      throw new BadRequestException(
        'Invalid status. Allowed values: available, unavailable, archived.',
      );
    }

    // Check if the service exists
    await this.ensureServiceExists(id);

    return this.prisma.service.update({
      where: { id },
      data: { status },
    });
  }

  async incrementViews(id: number) {
    // Check if the service exists
    await this.ensureServiceExists(id);

    return this.prisma.service.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });
  }

  async findFeatured(limit: number = 6) {
    return this.prisma.service.findMany({
      where: {
        status: 'available',
      },
      take: limit,
      include: {
        category: true,
        provider: true,
        assets: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Check if a service exists by ID.
   * Throws a NotFoundException if the service does not exist.
   */
  private async ensureServiceExists(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  /**
   * Validate the service ID.
   * Throws a BadRequestException if the ID is invalid.
   */
  private validateServiceId(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid service ID');
    }
  }
}
