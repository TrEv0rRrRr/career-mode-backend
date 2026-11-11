import { MatchLeg, MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getCopaTestCalendar = (year1: string): CalendarEntry[] => {
  return [
    {
      matchType: MatchType.SEMI_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year1}-12-15`),
    },
    {
      matchType: MatchType.SEMI_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year1}-12-22`),
    },
    {
      matchType: MatchType.THIRD_PLACE,
      date: new Date(`${year1}-12-29`),
    },
    {
      matchType: MatchType.FINAL,
      date: new Date(`${year1}-12-30`),
    },
  ];
};
