import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type PrismaModel = {
  findUnique: (args: {
    where: { id: number };
    include?: unknown;
  }) => Promise<unknown>;
};

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchById(
    model: string,
    id: number,
    include?: unknown,
  ): Promise<unknown> {
    const prismaClient = this.prisma as unknown as Record<string, PrismaModel>;
    const prismaModel = prismaClient[model.toLowerCase()];
    if (!prismaModel) {
      throw new NotFoundException(`Model ${model} not found`);
    }

    const result = await prismaModel.findUnique({
      where: { id },
      include,
    });

    if (!result) {
      throw new NotFoundException(`${model} with ID ${id} not found`);
    }

    return result;
  }
}
