import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceassetDto } from './dto/create-serviceasset.dto';
import { UpdateServiceassetDto } from './dto/update-serviceasset.dto';

@Injectable()
export class ServiceassetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceassetDto: CreateServiceassetDto) {
    const { serviceId, type, imageUrl, caption, areaName } =
      createServiceassetDto;

    // Ensure the service exists
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Validate the asset type and required fields
    if (type === 'IMAGE') {
      if (!imageUrl) {
        throw new BadRequestException('Image URL is required for IMAGE assets');
      }
    } else if (type === 'AREA') {
      if (!areaName) {
        throw new BadRequestException('Area name is required for AREA assets');
      }
    } else {
      throw new BadRequestException(
        'Invalid asset type. Allowed values: IMAGE, AREA',
      );
    }

    // Create the service asset
    return this.prisma.serviceAsset.create({
      data: {
        serviceId,
        type,
        imageUrl: type === 'IMAGE' ? imageUrl : null,
        caption: type === 'IMAGE' ? caption : null,
        areaName: type === 'AREA' ? areaName : null,
      },
    });
  }

  async findAll() {
    return this.prisma.serviceAsset.findMany({
      include: {
        service: true, // Include associated service details
      },
    });
  }

  async findOne(id: number) {
    const serviceAsset = await this.prisma.serviceAsset.findUnique({
      where: { id },
      include: {
        service: true, // Include associated service details
      },
    });
    if (!serviceAsset) {
      throw new NotFoundException(`Service asset with ID ${id} not found`);
    }
    return serviceAsset;
  }

  async update(id: number, updateServiceassetDto: UpdateServiceassetDto) {
    const { type, imageUrl, caption, areaName } = updateServiceassetDto;

    // Check if the service asset exists
    const serviceAsset = await this.prisma.serviceAsset.findUnique({
      where: { id },
    });
    if (!serviceAsset) {
      throw new NotFoundException(`Service asset with ID ${id} not found`);
    }

    // Validate the asset type and required fields
    if (type === 'IMAGE') {
      if (!imageUrl) {
        throw new BadRequestException('Image URL is required for IMAGE assets');
      }
    } else if (type === 'AREA') {
      if (!areaName) {
        throw new BadRequestException('Area name is required for AREA assets');
      }
    } else if (type) {
      throw new BadRequestException(
        'Invalid asset type. Allowed values: IMAGE, AREA',
      );
    }

    // Update the service asset
    return this.prisma.serviceAsset.update({
      where: { id },
      data: {
        type: type || serviceAsset.type,
        imageUrl: type === 'IMAGE' ? imageUrl : serviceAsset.imageUrl,
        caption: type === 'IMAGE' ? caption : serviceAsset.caption,
        areaName: type === 'AREA' ? areaName : serviceAsset.areaName,
      },
    });
  }

  async remove(id: number) {
    const serviceAsset = await this.prisma.serviceAsset.findUnique({
      where: { id },
    });
    if (!serviceAsset) {
      throw new NotFoundException(`Service asset with ID ${id} not found`);
    }

    return this.prisma.serviceAsset.delete({
      where: { id },
    });
  }
}
