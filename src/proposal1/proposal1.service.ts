import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposal1Dto } from './dto/create-proposal1.dto';
import { UpdateProposal1Dto } from './dto/update-proposal1.dto';

@Injectable()
export class Proposal1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProposal1Dto: CreateProposal1Dto) {
    const { providerId, serviceId, coverLetter, bidAmount } =
      createProposal1Dto;

    // Ensure the provider exists
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    // Ensure the service exists
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Create the proposal
    return this.prisma.proposal.create({
      data: {
        providerId,
        serviceId,
        coverLetter,
        bidAmount,
        status: 'PENDING', // Default status
      },
    });
  }

  async findAll() {
    return this.prisma.proposal.findMany({
      include: {
        provider: true, // Include provider details
        service: true, // Include service details
      },
    });
  }

  async findOne(id: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        provider: true,
        service: true,
      },
    });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return proposal;
  }

  async update(id: number, updateProposal1Dto: UpdateProposal1Dto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
    });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }

    return this.prisma.proposal.update({
      where: { id },
      data: updateProposal1Dto,
    });
  }

  async remove(id: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
    });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }

    return this.prisma.proposal.delete({
      where: { id },
    });
  }
}
