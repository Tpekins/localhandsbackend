import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerService } from './services/logger.service';
import { LogsController } from './controllers/logs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController, LogsController],
  providers: [SearchService, LoggerService],
  exports: [SearchService, LoggerService],
})
export class CommonModule {}
