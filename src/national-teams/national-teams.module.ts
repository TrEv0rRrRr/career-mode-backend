import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { NationalTeamsController } from './national-teams.controller.ts';
import { NationalTeamsRepository } from './national-teams.repository.ts';
import { NationalTeamsService } from './national-teams.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [NationalTeamsController],
  providers: [NationalTeamsService, NationalTeamsRepository],
  exports: [NationalTeamsService],
})
export class NationalTeamsModule {}
