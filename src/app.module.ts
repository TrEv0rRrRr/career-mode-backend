import { Module } from '@nestjs/common';
import { CareerModule } from './careers/careers.module.ts';
import { CompetitionsModule } from './competitions/competitions.module.ts';
import { KnockoutRoundModule } from './knockout-round/knockout-round.module.ts';
import { ManagersModule } from './managers/managers.module.ts';
import { MatchesModule } from './matches/matches.module.ts';
import { PlayersModule } from './players/players.module.ts';
import { PositionsModule } from './positions/positions.module.ts';
import { PrismaModule } from './prisma/prisma.module.ts';
import { SeasonsModule } from './seasons/seasons.module.ts';
import { StadiumsModule } from './stadiums/stadiums.module.ts';
import { TeamsModule } from './teams/teams.module.ts';
import { TransfersModule } from './transfers/transfers.module.ts';

@Module({
  imports: [
    PrismaModule,
    CompetitionsModule,
    PlayersModule,
    ManagersModule,
    StadiumsModule,
    TeamsModule,
    CareerModule,
    SeasonsModule,
    PositionsModule,
    TransfersModule,
    MatchesModule,
    KnockoutRoundModule,
  ],
})
export class AppModule {}
