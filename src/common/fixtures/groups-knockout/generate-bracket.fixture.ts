import { MatchLeg, MatchType } from '@prisma/client';
import { MatchPairing } from '../../types/MatchPairing.ts';
import { ParticipatingTeam } from '../../types/ParticipatingTeams.ts';

export const generateKnockoutBracket = (
  teams: ParticipatingTeam[],
  matchType: MatchType,
  isTwoLegged: boolean,
): MatchPairing[] => {
  if (teams.length !== 2)
    throw new Error('A bracket must contain exactly 2 teams');

  if (!isTwoLegged) {
    return [
      {
        homeTeamId: teams[0].team.id,
        awayTeamId: teams[1].team.id,
        matchType,
      },
    ];
  }

  return [
    {
      homeTeamId: teams[0].team.id,
      awayTeamId: teams[1].team.id,
      matchType,
      leg: MatchLeg.FIRST,
    },
    {
      homeTeamId: teams[1].team.id,
      awayTeamId: teams[0].team.id,
      matchType,
      leg: MatchLeg.SECOND,
    },
  ];
};
