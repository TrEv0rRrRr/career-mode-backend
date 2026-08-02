import { MatchLeg, MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getChampionsLeagueCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 1,
      date: new Date(`${year1}-09-15`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 2,
      date: new Date(`${year1}-09-29`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 3,
      date: new Date(`${year1}-10-20`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 4,
      date: new Date(`${year1}-11-03`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 5,
      date: new Date(`${year1}-11-24`),
    },
    {
      matchType: MatchType.GROUP_STAGE,
      matchday: 6,
      date: new Date(`${year1}-12-08`),
    },
    {
      matchType: MatchType.ROUND_OF_16,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-02-24`),
    },
    {
      matchType: MatchType.ROUND_OF_16,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-03-17`),
    },
    {
      matchType: MatchType.QUARTER_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-07`),
    },
    {
      matchType: MatchType.QUARTER_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-04-14`),
    },
    {
      matchType: MatchType.SEMI_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-28`),
    },
    {
      matchType: MatchType.SEMI_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-05-05`),
    },
    {
      matchType: MatchType.FINAL,
      date: new Date(`${year2}-05-30`),
    },
  ];
};
