import { Match } from '@prisma/client';
import { StandingTeam } from '../types/StandingTeam.ts';
import { resolveTie } from './resolveTie.ts';

export const recalculateStandings = (
  teams: StandingTeam[],
  matches: Match[],
): StandingTeam[] => {
  const standings = [...teams].sort((a, b) => b.points - a.points);

  const result: StandingTeam[] = [];

  let i = 0;

  while (i < standings.length) {
    const tiedTeams = [standings[i]];

    let j = i + 1;

    while (
      j < standings.length &&
      standings[j].points === standings[i].points
    ) {
      tiedTeams.push(standings[j]);
      j++;
    }

    if (tiedTeams.length === 1) {
      result.push(tiedTeams[0]);
    } else {
      const tiedTeamIds = new Set(tiedTeams.map(({ teamId }) => teamId));

      const headToHeadMatches = matches.filter(
        (match) =>
          tiedTeamIds.has(match.homeTeamId) &&
          tiedTeamIds.has(match.awayTeamId),
      );

      const resolvedTeams = resolveTie(tiedTeams, headToHeadMatches);

      result.push(...resolvedTeams);
    }

    i = j;
  }

  return result;
};
