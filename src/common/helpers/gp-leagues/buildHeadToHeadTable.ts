import { Match } from '@prisma/client';
import type { HeadToHeadStanding } from '../../types/HeadToHeadStanding.ts';

export const buildHeadToHeadTable = (
  matches: Match[],
): HeadToHeadStanding[] => {
  const stats = new Map<number, HeadToHeadStanding>();

  for (const match of matches) {
    const { homeClubId, awayClubId } = match;
    if (homeClubId === null || awayClubId === null) continue;

    if (!stats.has(homeClubId)) {
      stats.set(homeClubId, {
        clubId: homeClubId,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      });
    }

    if (!stats.has(awayClubId)) {
      stats.set(awayClubId, {
        clubId: awayClubId,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      });
    }

    const homeStats = stats.get(homeClubId)!;
    const awayStats = stats.get(awayClubId)!;

    if (match.homeGoals > match.awayGoals) homeStats.points += 3;

    if (match.awayGoals > match.homeGoals) awayStats.points += 3;

    if (match.homeGoals === match.awayGoals) {
      homeStats.points += 1;
      awayStats.points += 1;
    }

    homeStats.gf += match.homeGoals;
    homeStats.ga += match.awayGoals;
    awayStats.gf += match.awayGoals;
    awayStats.ga += match.homeGoals;
  }

  return [...stats.values()].map((club) => ({
    ...club,
    gd: club.gf - club.ga,
  }));
};
