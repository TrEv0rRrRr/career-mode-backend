import { Module } from '@nestjs/common';
import { CompetitionsModule } from '../competitions/competitions.module.ts';
import { CompetitionsRepository } from '../competitions/competitions.repository.ts';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { PlayersModule } from '../players/players.module.ts';
import { PlayersRepository } from '../players/players.repository.ts';
import { PlayersService } from '../players/players.service.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { SeasonsRepository } from '../seasons/seasons.repository.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { StadiumsModule } from '../stadiums/stadiums.module.ts';
import { StadiumsRepository } from '../stadiums/stadiums.repository.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { MatchesController } from './matches.controller.ts';
import { MatchesRepository } from './matches.repository.ts';
import { MatchesService } from './matches.service.ts';

@Module({
  imports: [
    PrismaModule,
    TeamsModule,
    PlayersModule,
    CompetitionsModule,
    StadiumsModule,
    SeasonsModule,
  ],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    MatchesRepository,
    TeamsService,
    TeamsRepository,
    PlayersService,
    PlayersRepository,
    CompetitionsService,
    CompetitionsRepository,
    StadiumsService,
    StadiumsRepository,
    SeasonsService,
    SeasonsRepository,
  ],
})
export class MatchesModule {}
