import { Module } from '@nestjs/common';
import { ServiceassetService } from './serviceasset.service';
import { ServiceassetController } from './serviceasset.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceassetController],
  providers: [ServiceassetService],
})
export class ServiceassetModule {}
