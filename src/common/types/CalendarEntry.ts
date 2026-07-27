import { MatchLeg, MatchType } from '@prisma/client';

export interface CalendarEntry {
  type: MatchType;
  date: Date;
  matchday?: number;
  leg?: MatchLeg;
}
