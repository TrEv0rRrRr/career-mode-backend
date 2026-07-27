import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getCupCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      type: MatchType.ROUND_OF_32,
      date: new Date(`${year1}-10-17`),
    },
    {
      type: MatchType.ROUND_OF_16,
      date: new Date(`${year2}-01-10`),
    },
    {
      type: MatchType.QUARTER_FINAL,
      date: new Date(`${year2}-02-14`),
    },
    {
      type: MatchType.SEMI_FINAL,
      date: new Date(`${year2}-03-28`),
    },
    {
      type: MatchType.FINAL,
      date: new Date(`${year2}-05-16`),
    },
  ];
};
