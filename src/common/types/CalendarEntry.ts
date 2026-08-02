import { MatchLeg, MatchType } from '@prisma/client';

export interface CalendarEntry {
  date: Date;
  matchType: MatchType;
  matchday?: number;
  leg?: MatchLeg;
}
