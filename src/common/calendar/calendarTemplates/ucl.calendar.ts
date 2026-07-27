import { MatchLeg, MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getChampionsLeagueCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      type: MatchType.GROUP_STAGE,
      matchday: 1,
      date: new Date(`${year1}-09-15`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 2,
      date: new Date(`${year1}-09-29`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 3,
      date: new Date(`${year1}-10-20`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 4,
      date: new Date(`${year1}-11-03`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 5,
      date: new Date(`${year1}-11-24`),
    },
    {
      type: MatchType.GROUP_STAGE,
      matchday: 6,
      date: new Date(`${year1}-12-08`),
    },
    {
      type: MatchType.ROUND_OF_16,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-02-24`),
    },
    {
      type: MatchType.ROUND_OF_16,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-03-17`),
    },
    {
      type: MatchType.QUARTER_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-07`),
    },
    {
      type: MatchType.QUARTER_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-04-14`),
    },
    {
      type: MatchType.SEMI_FINAL,
      leg: MatchLeg.FIRST,
      date: new Date(`${year2}-04-28`),
    },
    {
      type: MatchType.SEMI_FINAL,
      leg: MatchLeg.SECOND,
      date: new Date(`${year2}-05-05`),
    },
    {
      type: MatchType.FINAL,
      date: new Date(`${year2}-05-30`),
    },
  ];
};
