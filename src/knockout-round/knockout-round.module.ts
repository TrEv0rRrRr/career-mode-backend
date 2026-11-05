import { forwardRef, Module } from '@nestjs/common';
import { CompetitionsModule } from '../competitions/competitions.module.ts';
import { CompetitionFixtureModule } from '../competitions/modules/competition-fixture.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { KnockoutRoundController } from './knockout-round.controller.ts';
import { KnockoutRoundRepository } from './knockout-round.repository.ts';
import { KnockoutRoundService } from './knockout-round.service.ts';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => CompetitionsModule),
    forwardRef(() => CompetitionFixtureModule),
  ],
  controllers: [KnockoutRoundController],
  providers: [KnockoutRoundService, KnockoutRoundRepository],
  exports: [KnockoutRoundService],
})
export class KnockoutRoundModule {}
