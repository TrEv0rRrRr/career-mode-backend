import { MatchLeg, MatchType } from '@prisma/client';
export interface MatchPairing {
  homeClubId: number;
  awayClubId: number;
  matchType: MatchType;
  matchday?: number;
  leg?: MatchLeg;
}
