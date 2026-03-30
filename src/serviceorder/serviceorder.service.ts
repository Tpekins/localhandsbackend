import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceorderDto } from './dto/create-serviceorder.dto';
import { UpdateServiceorderDto } from './dto/update-serviceorder.dto';

@Injectable()
export class ServiceorderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceorderDto: CreateServiceorderDto) {
    const { serviceId, clientId, description, budget } = createServiceorderDto;

    // Ensure the service exists
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Ensure the client exists
    const client = await this.prisma.user.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Create the service order
    return this.prisma.serviceOrder.create({
      data: {
        serviceId,
        clientId,
        description,
        budget,
        status: 'PENDING', // Default status
      },
    });
  }

  async findAll() {
    return this.prisma.serviceOrder.findMany({
      include: {
        service: true, // Include service details
        client: true, // Include client details
        contract: true, // Include associated contract
      },
    });
  }

  async findOne(id: number) {
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        service: true, // Include service details
        client: true, // Include client details
        contract: true, // Include associated contract
      },
    });
    if (!serviceOrder) {
      throw new NotFoundException(`Service order with ID ${id} not found`);
    }
    return serviceOrder;
  }

  async update(id: number, updateServiceorderDto: UpdateServiceorderDto) {
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });
    if (!serviceOrder) {
      throw new NotFoundException(`Service order with ID ${id} not found`);
    }

    return this.prisma.serviceOrder.update({
      where: { id },
      data: updateServiceorderDto,
    });
  }

  async remove(id: number) {
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });
    if (!serviceOrder) {
      throw new NotFoundException(`Service order with ID ${id} not found`);
    }

    return this.prisma.serviceOrder.delete({
      where: { id },
    });
  }

  /**
   * Retrieve the contract associated with a specific service order.
   */
  async findContractByServiceOrder(serviceOrderId: number) {
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id: serviceOrderId },
      include: {
        contract: true, // Include associated contract
      },
    });
    if (!serviceOrder) {
      throw new NotFoundException(
        `Service order with ID ${serviceOrderId} not found`,
      );
    }
    return serviceOrder.contract;
  }
}
