import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CompetitionsController } from './competitions.controller.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CompetitionsService } from './competitions.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule],
  controllers: [CompetitionsController],
  providers: [
    CompetitionsService,
    CompetitionsRepository,
    TeamsService,
    TeamsRepository,
  ],
})
export class CompetitionsModule {}
