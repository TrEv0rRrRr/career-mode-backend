import { Match, MatchType } from '@prisma/client';
import { EditionType } from '../../types/EditionType.ts';
import { resolveSingleLegWinner } from './resolveSingleLegWinner.ts';
import { resolveTwoLeggedWinner } from './resolveTwoLeggedWinner.ts';

export const resolveKnockoutLosers = (
  edition: EditionType,
  matchesByRound: Match[],
): number[] => {
  if (!matchesByRound.length) {
    throw new Error('No matches provided.');
  }

  const ties = Object.groupBy(matchesByRound, (match) => match.tieId!);

  const isTwoLegged =
    edition &&
    edition.competition.hasTwoLeggedKnockout &&
    matchesByRound[0].type !== MatchType.FINAL;

  const losers: number[] = [];

  for (const tieMatches of Object.values(ties)) {
    if (!tieMatches) continue;

    const winner = isTwoLegged
      ? resolveTwoLeggedWinner(tieMatches)
      : resolveSingleLegWinner(tieMatches[0]);

    const teams = new Set<number>();

    for (const match of tieMatches) {
      teams.add(match.homeTeamId);
      teams.add(match.awayTeamId);
    }

    const loser = [...teams].find((teamId) => teamId !== winner);

    if (!loser) {
      throw new Error('Could not determine knockout loser.');
    }

    losers.push(loser);
  }

  return losers;
};
