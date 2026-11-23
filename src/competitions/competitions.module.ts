import { forwardRef, Module } from '@nestjs/common';
import { ClubsModule } from '../clubs/clubs.module.ts';
import { NationalTeamsModule } from '../national-teams/national-teams.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { StadiumsModule } from '../stadiums/stadiums.module.ts';
import { CompetitionsController } from './competitions.controller.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CompetitionsService } from './competitions.service.ts';
import { CompetitionFixtureModule } from './modules/competition-fixture.module.ts';
import { CompetitionEditionQueryService } from './services/competition-edition-query.service.ts';

@Module({
  imports: [
    PrismaModule,
    NationalTeamsModule,
    ClubsModule,
    SeasonsModule,
    forwardRef(() => CompetitionFixtureModule),
    StadiumsModule,
  ],
  controllers: [CompetitionsController],
  providers: [
    CompetitionsService,
    CompetitionsRepository,
    CompetitionEditionQueryService,
  ],
  exports: [CompetitionsService, CompetitionEditionQueryService],
})
export class CompetitionsModule {}
