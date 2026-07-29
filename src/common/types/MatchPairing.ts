import { MatchLeg, MatchType } from '@prisma/client';
export interface MatchPairing {
  homeTeamId: number;
  awayTeamId: number;
  matchType: MatchType;
  matchday?: number;
  leg?: MatchLeg;
}
