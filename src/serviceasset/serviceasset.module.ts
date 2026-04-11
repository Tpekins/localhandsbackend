import { Module } from '@nestjs/common';
import { ServiceassetService } from './serviceasset.service';
import { ServiceassetController } from './serviceasset.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceassetController],
  providers: [ServiceassetService, PrismaService],
})
export class ServiceassetModule {}
