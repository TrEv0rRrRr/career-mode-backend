import { MatchLeg, MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getEuropaLeagueCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      type: MatchType.GROUP_STAGE,
      matchday: 1,
      date: new Date(`${year1}-09-16`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 2,
      date: new Date(`${year1}-09-30`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 3,
      date: new Date(`${year1}-10-21`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 4,
      date: new Date(`${year1}-11-04`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 5,
      date: new Date(`${year1}-11-25`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 6,
      date: new Date(`${year1}-12-09`),
    },
    {
      type: MatchType.ROUND_OF_16,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-02-25`),
    },
    {
      type: MatchType.ROUND_OF_16,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-03-18`),
    },
    {
      type: MatchType.QUARTER_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-08`),
    },
    {
      type: MatchType.QUARTER_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-04-15`),
    },
    {
      type: MatchType.SEMI_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-29`),
    },
    {
      type: MatchType.SEMI_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-05-06`),
    },
    {
      type: MatchType.FINAL,
      date: new Date(`${year2}-05-29`),
    },
  ];
};
