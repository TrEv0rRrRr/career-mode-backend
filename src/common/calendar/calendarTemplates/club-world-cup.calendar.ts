import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getClubWorldCupCalendar = (year1: string): CalendarEntry[] => {
  return [
    {
      type: MatchType.SEMI_FINAL,
      date: new Date(`${year1}-12-15`),
    },
    {
      type: MatchType.THIRD_PLACE,
      date: new Date(`${year1}-12-17`),
    },
    {
      type: MatchType.FINAL,
      date: new Date(`${year1}-12-19`),
    },
  ];
};
