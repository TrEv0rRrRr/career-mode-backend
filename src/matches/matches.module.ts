import { forwardRef, Module } from '@nestjs/common';
import { ClubsModule } from '../clubs/clubs.module.ts';
import { CompetitionsModule } from '../competitions/competitions.module.ts';
import { KnockoutRoundModule } from '../knockout-round/knockout-round.module.ts';
import { PlayersModule } from '../players/players.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { StadiumsModule } from '../stadiums/stadiums.module.ts';
import { MatchesController } from './matches.controller.ts';
import { MatchesRepository } from './matches.repository.ts';
import { MatchesService } from './matches.service.ts';

@Module({
  imports: [
    PrismaModule,
    ClubsModule,
    PlayersModule,
    forwardRef(() => CompetitionsModule),
    StadiumsModule,
    forwardRef(() => KnockoutRoundModule),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
