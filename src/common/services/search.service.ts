import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchById(model: string, id: number, include?: any) {
    const prismaModel = (this.prisma as any)[model.toLowerCase()];
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
