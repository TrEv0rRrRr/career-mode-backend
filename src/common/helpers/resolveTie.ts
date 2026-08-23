import { Match } from '@prisma/client';
import { buildHeadToHeadTable } from './buildHeadToHeadTable.ts';

type StandingTeam = {
  teamId: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  yellowCards: number;
  redCards: number;
};

export const resolveTie = (
  tiedTeams: StandingTeam[],
  matches: Match[],
): StandingTeam[] => {
  const headToHeadTable = buildHeadToHeadTable(matches);

  const h2hMap = new Map(headToHeadTable.map((team) => [team.teamId, team]));

  return [...tiedTeams].sort((a, b) => {
    const aH2H = h2hMap.get(a.teamId)!;
    const bH2H = h2hMap.get(b.teamId)!;

    if (aH2H.points !== bH2H.points) {
      return bH2H.points - aH2H.points;
    }

    if (aH2H.gd !== bH2H.gd) {
      return bH2H.gd - aH2H.gd;
    }

    if (a.gd !== b.gd) {
      return b.gd - a.gd;
    }

    if (a.gf !== b.gf) {
      return b.gf - a.gf;
    }

    const aFairPlay = a.yellowCards + a.redCards * 3;
    const bFairPlay = b.yellowCards + b.redCards * 3;

    return aFairPlay - bFairPlay;
  });
};
