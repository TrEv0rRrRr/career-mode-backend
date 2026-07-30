import { MatchLeg, MatchType, Team } from '@prisma/client';
import { MatchPairing } from '../../types/MatchPairing.ts';

export const generateKnockoutBracket = (
  teams: Team[],
  matchType: MatchType,
  isTwoLegged: boolean,
): MatchPairing[] => {
  if (teams.length !== 2)
    throw new Error('A bracket must contain exactly 2 teams');

  if (!isTwoLegged) {
    return [
      {
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        matchType,
      },
    ];
  }

  return [
    {
      homeTeamId: teams[0].id,
      awayTeamId: teams[1].id,
      matchType,
      leg: MatchLeg.FIRST,
    },
    {
      homeTeamId: teams[1].id,
      awayTeamId: teams[0].id,
      matchType,
      leg: MatchLeg.SECOND,
    },
  ];
};
