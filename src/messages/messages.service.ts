import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    const { senderId, receiverId, content } = createMessageDto;

    const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    const receiver = await this.prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
    }

    return this.prisma.message.create({
      data: { senderId, receiverId, content },
      include: { sender: true, receiver: true },
    });
  }

  async findAll(filters?: { senderId?: string; receiverId?: string }) {
    const where: any = {};
    if (filters?.senderId) where.senderId = Number(filters.senderId);
    if (filters?.receiverId) where.receiverId = Number(filters.receiverId);

    return this.prisma.message.findMany({
      where,
      include: { sender: true, receiver: true },
      orderBy: { timestamp: 'asc' },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
      include: { sender: true, receiver: true },
    });
  }

  async remove(id: number) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return this.prisma.message.delete({ where: { id } });
  }
}
