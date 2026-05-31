import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Prisma } from '../generated/browser';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, message, type } = createNotificationDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.notification.create({
      data: { userId, message, type },
      include: { user: true },
    });
  }

  async findAll(filters?: { userId?: string; read?: string }) {
    const where: Prisma.NotificationWhereInput = {};
    if (filters?.userId) where.userId = Number(filters.userId);
    if (filters?.read !== undefined) where.read = filters.read === 'true';

    return this.prisma.notification.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: { user: true },
    });
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return this.prisma.notification.delete({ where: { id } });
  }
}
