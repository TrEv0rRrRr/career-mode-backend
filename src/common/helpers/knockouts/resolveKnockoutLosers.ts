import { Match } from '@prisma/client';
import { EditionType } from '../../types/EditionType.ts';
import { isTwoLeggedKnockoutRound } from './isTwoLeggedKnockoutRound.ts';
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

  const isTwoLegged = Boolean(
    edition &&
    isTwoLeggedKnockoutRound(
      matchesByRound[0].type,
      edition.competition.hasTwoLeggedKnockout,
    ),
  );

  const losers: number[] = [];

  for (const tieMatches of Object.values(ties)) {
    if (!tieMatches) continue;

    const winner = isTwoLegged
      ? resolveTwoLeggedWinner(tieMatches)
      : resolveSingleLegWinner(tieMatches[0]);

    const participants = new Set<number>();

    for (const match of tieMatches) {
      const homeId = match.homeNationalTeamId ?? match.homeClubId;
      const awayId = match.awayNationalTeamId ?? match.awayClubId;
      if (homeId === null || awayId === null)
        throw new Error('Knockout matches must have two participants.');

      participants.add(homeId);
      participants.add(awayId);
    }

    const loser = [...participants].find(
      (participantId) => participantId !== winner,
    );

    if (!loser) {
      throw new Error('Could not determine knockout loser.');
    }

    losers.push(loser);
  }

  return losers;
};
