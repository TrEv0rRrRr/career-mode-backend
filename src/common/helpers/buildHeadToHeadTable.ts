import { Match } from '@prisma/client';
import type { HeadToHeadStanding } from '../types/HeadToHeadStanding.ts';

export const buildHeadToHeadTable = (
  matches: Match[],
): HeadToHeadStanding[] => {
  const stats = new Map<number, HeadToHeadStanding>();

  for (const match of matches) {
    if (!stats.has(match.homeTeamId)) {
      stats.set(match.homeTeamId, {
        teamId: match.homeTeamId,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      });
    }

    if (!stats.has(match.awayTeamId)) {
      stats.set(match.awayTeamId, {
        teamId: match.awayTeamId,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      });
    }

    const homeStats = stats.get(match.homeTeamId)!;
    const awayStats = stats.get(match.awayTeamId)!;

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

  return [...stats.values()].map((team) => ({
    ...team,
    gd: team.gf - team.ga,
  }));
};
