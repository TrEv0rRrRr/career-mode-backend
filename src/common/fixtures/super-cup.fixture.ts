import { MatchType } from '@prisma/client';
import { MatchPairing } from '../types/MatchPairing.ts';
import { ParticipatingTeam } from '../types/ParticipatingTeams.ts';

export const generateSuperCupPairing = (
  teams: ParticipatingTeam[],
): MatchPairing => {
  if (teams.length !== 2) {
    throw new Error('Super Cup pairing requires exactly 2 teams');
  }

  return {
    homeTeamId: teams[0].team.id,
    awayTeamId: teams[1].team.id,
    matchType: MatchType.FINAL,
  };
};
