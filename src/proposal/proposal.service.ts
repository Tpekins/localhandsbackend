import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProposalDto: CreateProposalDto) {
    const { providerId, serviceId, coverLetter, bidAmount } = createProposalDto;
    const provider = await this.prisma.user.findUnique({ where: { id: providerId } });
    if (!provider) { throw new NotFoundException(`Provider with ID ${providerId} not found`); }
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) { throw new NotFoundException(`Service with ID ${serviceId} not found`); }
    return this.prisma.proposal.create({
      data: { providerId, serviceId, coverLetter, bidAmount, status: 'PENDING' },
    });
  }

  async findAll() { return this.prisma.proposal.findMany({ include: { provider: true, service: true } }); }

  async findOne(id: number) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id }, include: { provider: true, service: true } });
    if (!proposal) { throw new NotFoundException(`Proposal with ID ${id} not found`); }
    return proposal;
  }

  async update(id: number, updateProposalDto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) { throw new NotFoundException(`Proposal with ID ${id} not found`); }
    return this.prisma.proposal.update({ where: { id }, data: updateProposalDto });
  }

  async remove(id: number) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) { throw new NotFoundException(`Proposal with ID ${id} not found`); }
    return this.prisma.proposal.delete({ where: { id } });
  }
}
