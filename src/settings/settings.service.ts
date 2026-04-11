import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsDto } from './dto/system-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemSettings() {
    const settings = await this.prisma.systemSettings.findFirst();
    if (!settings) {
      // Return default settings if none exist
      return {
        maintenance_mode: false,
        allow_registration: true,
        review_auto_approve: false,
        payment_gateway: 'stripe',
        email_notifications: true,
        max_file_size: 5,
        currency: 'USD',
      };
    }
    return settings;
  }

  async updateSystemSettings(settings: SystemSettingsDto) {
    const existingSettings = await this.prisma.systemSettings.findFirst();

    if (existingSettings) {
      return this.prisma.systemSettings.update({
        where: { id: existingSettings.id },
        data: settings,
      });
    }

    return this.prisma.systemSettings.create({
      data: settings,
    });
  }
}
