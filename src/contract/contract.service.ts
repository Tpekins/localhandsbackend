import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractStatus, Prisma } from '../generated/browser';

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    const { serviceOrderId, escrowAmount, status } = createContractDto;
    const serviceOrder = await this.prisma.serviceOrder.findUnique({
      where: { id: serviceOrderId },
    });
    if (!serviceOrder) {
      throw new NotFoundException(
        `Service order with ID ${serviceOrderId} not found`,
      );
    }
    return this.prisma.contract.create({
      data: { serviceOrderId, escrowAmount, status: status || 'ACTIVE' },
      include: { users: true },
    });
  }

  async findAll(filters?: { status?: ContractStatus }) {
    const where: Prisma.ContractWhereInput = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    return this.prisma.contract.findMany({
      where,
      include: { serviceOrder: true, users: true },
    });
  }

  async findOne(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { serviceOrder: true, users: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    await this.ensureContractExists(id);
    const updateData = {
      escrowAmount: updateContractDto.escrowAmount,
      status: updateContractDto.status,
    };
    return this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: { serviceOrder: true, users: true },
    });
  }

  async remove(id: number) {
    await this.ensureContractExists(id);
    return this.prisma.contract.delete({ where: { id } });
  }

  private async ensureContractExists(id: number) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }
}
