import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoggerService } from '../services/logger.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Interface for log request data
interface LogRequestDto {
  level: 'error' | 'warn' | 'info' | 'debug';
  category: string;
  message: string;
  timestamp: string;
  data?: any;
}

@ApiTags('Logs')
@Controller('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly loggerService: LoggerService) {}

  /**
   * Handle incoming log requests from frontend
   */
  @Post()
  @ApiOperation({ summary: 'Create new log entry' })
  async createLog(@Body() logRequest: LogRequestDto) {
    const { level, category, message, data } = logRequest;

    switch (level) {
      case 'error':
        await this.loggerService.error(category, message, data);
        break;
      case 'warn':
        await this.loggerService.warn(category, message, data);
        break;
      case 'info':
        await this.loggerService.info(category, message, data);
        break;
      case 'debug':
        await this.loggerService.debug(category, message, data);
        break;
    }

    return { success: true };
  }
}
