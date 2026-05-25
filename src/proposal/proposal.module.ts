import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProposalController],
  providers: [ProposalService, PrismaService],
})
export class ProposalModule {}
