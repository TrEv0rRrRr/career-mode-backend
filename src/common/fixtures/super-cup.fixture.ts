import { MatchType, Team } from '@prisma/client';
import { MatchPairing } from '../types/MatchPairing.ts';

export const generateSuperCupPairing = (teams: Team[]): MatchPairing => {
  const [homeTeam, awayTeam] = teams;

  return {
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    matchType: MatchType.FINAL,
  };
};
