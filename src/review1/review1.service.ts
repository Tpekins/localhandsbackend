import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReview1Dto } from './dto/create-review1.dto';
import { UpdateReview1Dto } from './dto/update-review1.dto';

@Injectable()
export class Review1Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReview1Dto: CreateReview1Dto) {
    const { contractId, reviewerId, rating, comment } = createReview1Dto;

    // Ensure the contract exists
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    // Ensure the reviewer exists
    const reviewer = await this.prisma.user.findUnique({
      where: { id: reviewerId },
    });
    if (!reviewer) {
      throw new NotFoundException(`Reviewer with ID ${reviewerId} not found`);
    }

    // Create the review
    return this.prisma.review.create({
      data: {
        contractId,
        reviewerId,
        rating,
        comment,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        contract: true, // Include contract details
        reviewer: true, // Include reviewer details
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        contract: true,
        reviewer: true,
      },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReview1Dto: UpdateReview1Dto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReview1Dto,
    });
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
