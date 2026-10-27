import { forwardRef, Module } from '@nestjs/common';
import { MatchesModule } from '../../matches/matches.module.ts';
import { SeasonsModule } from '../../seasons/seasons.module.ts';
import { CompetitionsModule } from '../competitions.module.ts';
import { CompetitionFixtureService } from '../services/competition-fixture.service.ts';

@Module({
  imports: [
    forwardRef(() => CompetitionsModule),
    forwardRef(() => MatchesModule),
    SeasonsModule,
  ],
  providers: [CompetitionFixtureService],
  exports: [CompetitionFixtureService],
})
export class CompetitionFixtureModule {}
