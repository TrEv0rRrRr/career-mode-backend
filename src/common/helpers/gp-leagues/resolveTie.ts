import { Match } from '@prisma/client';
import { StandingClub } from '../../types/StandingClub.ts';
import { buildHeadToHeadTable } from './buildHeadToHeadTable.ts';

export const resolveTie = (
  tiedTeams: StandingClub[],
  matches: Match[],
): StandingClub[] => {
  const headToHeadTable = buildHeadToHeadTable(matches);

  const h2hMap = new Map(headToHeadTable.map((club) => [club.clubId, club]));

  const compareOverallCriteria = (a: StandingClub, b: StandingClub) => {
    if (a.gd !== b.gd) {
      return b.gd - a.gd;
    }

    if (a.gf !== b.gf) {
      return b.gf - a.gf;
    }

    const aFairPlay = a.yellowCards + a.redCards * 3;
    const bFairPlay = b.yellowCards + b.redCards * 3;

    return aFairPlay - bFairPlay;
  };

  if (tiedTeams.some(({ clubId }) => !h2hMap.has(clubId))) {
    return [...tiedTeams].sort(compareOverallCriteria);
  }

  return [...tiedTeams].sort((a, b) => {
    const aH2H = h2hMap.get(a.clubId)!;
    const bH2H = h2hMap.get(b.clubId)!;

    if (aH2H.points !== bH2H.points) {
      return bH2H.points - aH2H.points;
    }

    if (aH2H.gd !== bH2H.gd) {
      return bH2H.gd - aH2H.gd;
    }

    return compareOverallCriteria(a, b);
  });
};
