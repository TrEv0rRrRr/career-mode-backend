import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getCopaGruposTestCalendar = (year1: string): CalendarEntry[] => {
  return [
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 1,
      date: new Date(`${year1}-11-01`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 2,
      date: new Date(`${year1}-11-08`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 3,
      date: new Date(`${year1}-11-15`),
    },
    {
      matchType: MatchType.QUARTER_FINAL,
      date: new Date(`${year1}-11-22`),
    },
    {
      matchType: MatchType.SEMI_FINAL,
      date: new Date(`${year1}-11-29`),
    },
    {
      matchType: MatchType.THIRD_PLACE,
      date: new Date(`${year1}-12-07`),
    },
    {
      matchType: MatchType.FINAL,
      date: new Date(`${year1}-12-13`),
    },
  ];
};
