import { Module } from '@nestjs/common';
import { MatchesModule } from '../matches/matches.module.ts';
import { MatchesRepository } from '../matches/matches.repository.ts';
import { MatchesService } from '../matches/matches.service.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { SeasonsRepository } from '../seasons/seasons.repository.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CompetitionsController } from './competitions.controller.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CompetitionsService } from './competitions.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule, SeasonsModule, MatchesModule],
  controllers: [CompetitionsController],
  providers: [
    CompetitionsService,
    CompetitionsRepository,
    TeamsService,
    TeamsRepository,
    SeasonsService,
    SeasonsRepository,
    MatchesService,
    MatchesRepository,
  ],
})
export class CompetitionsModule {}
