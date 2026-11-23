import { Match } from '@prisma/client';
import { StandingClub } from '../../types/StandingClub.ts';
import { resolveTie } from './resolveTie.ts';

export const recalculateStandings = (
  clubs: StandingClub[],
  matches: Match[],
): StandingClub[] => {
  const standings = [...clubs].sort(
    (a, b) => (b.points || 0) - (a.points || 0),
  );

  const result: StandingClub[] = [];

  let i = 0;

  while (i < standings.length) {
    const tiedClubs = [standings[i]];

    let j = i + 1;

    while (
      j < standings.length &&
      standings[j].points === standings[i].points
    ) {
      tiedClubs.push(standings[j]);
      j++;
    }

    if (tiedClubs.length === 1) {
      result.push(tiedClubs[0]);
    } else {
      const tiedClubIds = new Set(tiedClubs.map(({ clubId }) => clubId));

      const headToHeadMatches = matches.filter(
        (match) =>
          match.homeClubId !== null &&
          match.awayClubId !== null &&
          tiedClubIds.has(match.homeClubId) &&
          tiedClubIds.has(match.awayClubId),
      );

      const resolvedClubs = resolveTie(tiedClubs, headToHeadMatches);

      result.push(...resolvedClubs);
    }

    i = j;
  }

  return result;
};
