import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getNationalSuperCupsCalendar = (
  year1: string,
): CalendarEntry[] => {
  return [
    {
      type: MatchType.FINAL,
      date: new Date(`${year1}-08-16`),
    },
  ];
};
