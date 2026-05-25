import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { contractId, reviewerId, rating, comment } = createReviewDto;
    const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) { throw new NotFoundException(`Contract with ID ${contractId} not found`); }
    const reviewer = await this.prisma.user.findUnique({ where: { id: reviewerId } });
    if (!reviewer) { throw new NotFoundException(`Reviewer with ID ${reviewerId} not found`); }
    return this.prisma.review.create({ data: { contractId, reviewerId, rating, comment } });
  }

  async findAll() { return this.prisma.review.findMany({ include: { contract: true, reviewer: true } }); }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id }, include: { contract: true, reviewer: true } });
    if (!review) { throw new NotFoundException(`Review with ID ${id} not found`); }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) { throw new NotFoundException(`Review with ID ${id} not found`); }
    return this.prisma.review.update({ where: { id }, data: updateReviewDto });
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) { throw new NotFoundException(`Review with ID ${id} not found`); }
    return this.prisma.review.delete({ where: { id } });
  }
}
