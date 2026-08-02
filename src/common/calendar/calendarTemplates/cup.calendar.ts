import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getCupCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      matchType: MatchType.ROUND_OF_32,
      date: new Date(`${year1}-10-17`),
    },
    {
      matchType: MatchType.ROUND_OF_16,
      date: new Date(`${year2}-01-10`),
    },
    {
      matchType: MatchType.QUARTER_FINAL,
      date: new Date(`${year2}-02-14`),
    },
    {
      matchType: MatchType.SEMI_FINAL,
      date: new Date(`${year2}-03-28`),
    },
    {
      matchType: MatchType.FINAL,
      date: new Date(`${year2}-05-16`),
    },
  ];
};
