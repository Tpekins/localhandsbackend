import { Module } from '@nestjs/common';
import { ServiceorderService } from './serviceorder.service';
import { ServiceorderController } from './serviceorder.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceorderController],
  providers: [ServiceorderService],
})
export class ServiceorderModule {}
