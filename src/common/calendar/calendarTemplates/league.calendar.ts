import { MatchType } from '@prisma/client';
import { CalendarEntry } from '../../types/CalendarEntry.ts';

export const getLeagueCalendar = (
  year1: string,
  year2: string,
): CalendarEntry[] => {
  return [
    {
      matchType: MatchType.LEAGUE,
      matchday: 1,
      date: new Date(`${year1}-08-22`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 2,
      date: new Date(`${year1}-08-29`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 3,
      date: new Date(`${year1}-09-19`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 4,
      date: new Date(`${year1}-09-23`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 5,
      date: new Date(`${year1}-09-26`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 6,
      date: new Date(`${year1}-10-03`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 7,
      date: new Date(`${year1}-10-24`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 8,
      date: new Date(`${year1}-10-28`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 9,
      date: new Date(`${year1}-10-31`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 10,
      date: new Date(`${year1}-11-07`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 11,
      date: new Date(`${year1}-11-18`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 12,
      date: new Date(`${year1}-11-21`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 13,
      date: new Date(`${year1}-11-28`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 14,
      date: new Date(`${year1}-12-02`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 15,
      date: new Date(`${year1}-12-05`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 16,
      date: new Date(`${year1}-12-12`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 17,
      date: new Date(`${year1}-12-23`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 18,
      date: new Date(`${year1}-12-26`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 19,
      date: new Date(`${year1}-12-30`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 20,
      date: new Date(`${year2}-01-03`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 21,
      date: new Date(`${year2}-01-14`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 22,
      date: new Date(`${year2}-01-17`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 23,
      date: new Date(`${year2}-01-21`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 24,
      date: new Date(`${year2}-01-24`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 25,
      date: new Date(`${year2}-02-01`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 26,
      date: new Date(`${year2}-02-04`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 27,
      date: new Date(`${year2}-02-07`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 28,
      date: new Date(`${year2}-02-21`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 29,
      date: new Date(`${year2}-02-28`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 30,
      date: new Date(`${year2}-03-07`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 31,
      date: new Date(`${year2}-03-14`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 32,
      date: new Date(`${year2}-03-21`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 33,
      date: new Date(`${year2}-04-11`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 34,
      date: new Date(`${year2}-04-18`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 35,
      date: new Date(`${year2}-04-25`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 36,
      date: new Date(`${year2}-05-02`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 37,
      date: new Date(`${year2}-05-09`),
    },
    {
      matchType: MatchType.LEAGUE,
      matchday: 38,
      date: new Date(`${year2}-05-23`),
    },
  ];
};
