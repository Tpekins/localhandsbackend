import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContract1Dto } from './dto/create-contract1.dto';
import { UpdateContract1Dto } from './dto/update-contract1.dto';

@Injectable()
export class Contract1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContract1Dto: CreateContract1Dto) {
    const { serviceOrderId, escrowAmount, status } = createContract1Dto;

    // Ensure the service order exists
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id: serviceOrderId },
    });
    if (!serviceOrder) {
      throw new NotFoundException(
        `Service order with ID ${serviceOrderId} not found`,
      );
    }

    // Create the contract
    return this.prisma.contract.create({
      data: {
        serviceOrderId,
        escrowAmount,
        status: status || 'ACTIVE', // Default status
      },
      include: {
        users: true, // Include associated users
      },
    });
  }

  async findAll() {
    return this.prisma.contract.findMany({
      include: {
        serviceOrder: true, // Include service order details
        users: true, // Include associated users
      },
    });
  }

  async findOne(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        serviceOrder: true, // Include service order details
        users: true, // Include associated users
      },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async update(id: number, updateContract1Dto: UpdateContract1Dto) {
    // Check if the contract exists
    await this.ensureContractExists(id);

    // Transform DTO to Prisma update input
    const updateData = {
      escrowAmount: updateContract1Dto.escrowAmount,
      status: updateContract1Dto.status,
    };

    return this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        serviceOrder: true,
        users: true,
      },
    });
  }

  async remove(id: number) {
    // Check if the contract exists
    await this.ensureContractExists(id);

    return this.prisma.contract.delete({
      where: { id },
    });
  }

  /**
   * Check if a contract exists by ID.
   * Throws a NotFoundException if the contract does not exist.
   */
  private async ensureContractExists(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }
}
