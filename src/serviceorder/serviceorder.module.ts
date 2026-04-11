import { Module } from '@nestjs/common';
import { ServiceorderService } from './serviceorder.service';
import { ServiceorderController } from './serviceorder.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceorderController],
  providers: [ServiceorderService, PrismaService],
})
export class ServiceorderModule {}
