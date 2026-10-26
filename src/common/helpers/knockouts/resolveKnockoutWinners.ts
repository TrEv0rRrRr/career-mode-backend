import { Match, MatchType } from '@prisma/client';
import { EditionType } from '../../types/EditionType.ts';
import { resolveSingleLegWinner } from './resolveSingleLegWinner.ts';
import { resolveTwoLeggedWinner } from './resolveTwoLeggedWinner.ts';

export const resolveKnockoutWinners = (
  edition: EditionType,
  matchesByRound: Match[],
) => {
  const ties = Object.groupBy(matchesByRound, (match) => match.tieId!);

  if (!matchesByRound.length) {
    throw new Error('No matches provided.');
  }

  const isTwoLegged =
    edition &&
    edition.competition.hasTwoLeggedKnockout &&
    matchesByRound[0].type !== MatchType.FINAL;

  const winners: number[] = [];

  for (const tieMatches of Object.values(ties)) {
    if (!tieMatches) continue;

    const winner = isTwoLegged
      ? resolveTwoLeggedWinner(tieMatches)
      : resolveSingleLegWinner(tieMatches[0]);

    winners.push(winner);
  }

  return winners;
};
