import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { CompetitionsController } from './competitions.controller.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CompetitionsService } from './competitions.service.ts';
import { CompetitionFixtureModule } from './modules/competition-fixture.module.ts';
import { CompetitionEditionQueryService } from './services/competition-edition-query.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule, SeasonsModule, CompetitionFixtureModule],
  controllers: [CompetitionsController],
  providers: [
    CompetitionsService,
    CompetitionsRepository,
    CompetitionEditionQueryService,
  ],
  exports: [CompetitionsService, CompetitionEditionQueryService],
})
export class CompetitionsModule {}
