import { Module } from '@nestjs/common';
import { CareerModule } from './careers/careers.module.ts';
import { CompetitionsModule } from './competitions/competitions.module.ts';
import { ManagersModule } from './managers/managers.module.ts';
import { PlayersModule } from './players/players.module.ts';
import { PositionsModule } from './positions/positions.module.ts';
import { PrismaModule } from './prisma/prisma.module.ts';
import { PrismaService } from './prisma/prisma.service.ts';
import { SeasonsModule } from './seasons/seasons.module.ts';
import { StadiumsModule } from './stadiums/stadiums.module.ts';
import { TeamsModule } from './teams/teams.module.ts';

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
  ],
  providers: [PrismaService],
})
export class AppModule {}
