import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsDto } from './dto/system-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemSettings() {
    const settings = await this.prisma.systemSettings.findFirst();
    if (!settings) {
      return {
        maintenanceMode: false,
        allowRegistration: true,
        reviewAutoApprove: false,
        paymentGateway: 'fapshi',
        emailNotifications: true,
        maxFileSize: 5,
        currency: 'XAF',
        currencySymbol: 'FCFA',
        supportEmail: null,
      };
    }
    return {
      id: settings.id,
      maintenanceMode: settings.maintenance_mode,
      allowRegistration: settings.allow_registration,
      reviewAutoApprove: settings.review_auto_approve,
      paymentGateway: settings.payment_gateway,
      emailNotifications: settings.email_notifications,
      maxFileSize: settings.max_file_size,
      currency: settings.currency,
      currencySymbol: settings.currency_symbol,
      supportEmail: settings.supportEmail,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }

  async updateSystemSettings(settings: SystemSettingsDto) {
    const existingSettings = await this.prisma.systemSettings.findFirst();

    if (existingSettings) {
      await this.prisma.systemSettings.update({
        where: { id: existingSettings.id },
        data: settings,
      });
    } else {
      await this.prisma.systemSettings.create({
        data: settings,
      });
    }

    return this.getSystemSettings();
  }
}
