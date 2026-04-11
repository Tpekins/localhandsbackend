import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from './services/logger.service';
import { LogsController } from './controllers/logs.controller';

@Module({
  controllers: [SearchController, LogsController],
  providers: [SearchService, PrismaService, LoggerService],
  exports: [SearchService, LoggerService], // Export LoggerService so other modules can use it
})
export class CommonModule {}
