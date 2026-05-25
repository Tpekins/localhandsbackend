import { Module } from '@nestjs/common';
import { ServicepackageService } from './servicepackage.service';
import { ServicepackageController } from './servicepackage.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicepackageController],
  providers: [ServicepackageService],
})
export class ServicepackageModule {}
