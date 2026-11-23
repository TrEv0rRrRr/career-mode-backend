import {
  CompetitionFormat,
  CompetitionType,
  Match,
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { resolveSingleLegWinner } from './resolveSingleLegWinner.ts';
import { resolveTwoLeggedWinner } from './resolveTwoLeggedWinner.ts';
import { resolveKnockoutLosers } from './resolveKnockoutLosers.ts';
import { EditionType } from '../../types/EditionType.ts';

const nationalTeamMatch = (overrides: Partial<Match>): Match => ({
  id: 1,
  date: new Date('2026-01-01'),
  homeGoals: 0,
  awayGoals: 0,
  status: MatchStatus.PLAYED,
  stadiumId: 1,
  matchday: null,
  homeClubId: null,
  awayClubId: null,
  winnerClubId: null,
  leg: null,
  homePenaltyGoals: null,
  awayPenaltyGoals: null,
  tieId: null,
  competitionEditionId: 1,
  type: MatchType.QUARTER_FINAL,
  finishType: MatchFinishType.REGULAR_TIME,
  homeNationalTeamId: 1,
  awayNationalTeamId: 2,
  winnerNationalTeamId: null,
  ...overrides,
});

describe('knockout winner resolution for national teams', () => {
  it('resolves a single-leg winner from the national team winner id', () => {
    const match = nationalTeamMatch({
      winnerNationalTeamId: 2,
    });

    expect(resolveSingleLegWinner(match)).toBe(2);
  });

  it('resolves a two-legged winner using aggregate national team scores', () => {
    const firstLeg = nationalTeamMatch({
      id: 1,
      leg: MatchLeg.FIRST,
      tieId: 1,
      homeGoals: 1,
    });
    const secondLeg = nationalTeamMatch({
      id: 2,
      leg: MatchLeg.SECOND,
      tieId: 1,
      homeNationalTeamId: 2,
      awayNationalTeamId: 1,
      awayGoals: 1,
      winnerNationalTeamId: 1,
    });

    expect(resolveTwoLeggedWinner([firstLeg, secondLeg])).toBe(1);
  });

  it('resolves the eliminated national team from a single-leg tie', () => {
    const edition: EditionType = {
      competition: {
        id: 1,
        name: 'International Cup',
        type: CompetitionType.NATIONAL_TEAMS,
        format: CompetitionFormat.KNOCKOUT,
        logo: null,
        hasThirdPlaceMatch: false,
        maxTeamsNumber: 32,
        hasTwoLeggedKnockout: false,
        groups: null,
        teamsPerGroup: null,
      },
    };
    const match = nationalTeamMatch({
      homeNationalTeamId: 1,
      awayNationalTeamId: 2,
      winnerNationalTeamId: 1,
    });

    expect(resolveKnockoutLosers(edition, [match])).toEqual([2]);
  });
});
