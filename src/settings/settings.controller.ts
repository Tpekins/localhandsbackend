import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SystemSettingsDto } from './dto/system-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RoleGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('system')
  @Roles('ADMIN')
  async getSystemSettings() {
    return this.settingsService.getSystemSettings();
  }

  @Put('system')
  @Roles('ADMIN')
  async updateSystemSettings(@Body() systemSettings: SystemSettingsDto) {
    return this.settingsService.updateSystemSettings(systemSettings);
  }
}
