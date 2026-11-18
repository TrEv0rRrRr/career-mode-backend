import { Match } from '@prisma/client';
import { EditionType } from '../../types/EditionType.ts';
import { isTwoLeggedKnockoutRound } from './isTwoLeggedKnockoutRound.ts';
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

  const isTwoLegged = Boolean(
    edition &&
    isTwoLeggedKnockoutRound(
      matchesByRound[0].type,
      edition.competition.hasTwoLeggedKnockout,
    ),
  );

  const winners: number[] = [];

  for (const tieMatches of Object.values(ties)) {
    if (!tieMatches) continue;

    const winner = isTwoLegged
      ? resolveTwoLeggedWinner(tieMatches)
      : resolveSingleLegWinner(tieMatches[0]);

    if (winner === null) {
      throw new Error('Knockout matches must have a club-team winner.');
    }

    winners.push(winner);
  }

  return winners;
};
