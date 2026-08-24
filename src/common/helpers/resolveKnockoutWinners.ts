import { $Enums, Match, MatchType } from '@prisma/client';
import { resolveSingleLegWinner } from './resolveSingleLegWinner.ts';
import { resolveTwoLeggedWinner } from './resolveTwoLeggedWinner.ts';

type EditionType = {
  competition: {
    name: string;
    id: number;
    type: $Enums.CompetitionType;
    format: $Enums.CompetitionFormat;
    logo: string | null;
    hasThirdPlaceMatch: boolean;
    maxTeamsNumber: number;
    hasTwoLeggedKnockout: boolean;
    groups: number | null;
    teamsPerGroup: number | null;
  };
} | null;

export const resolveKnockoutWinners = (
  edition: EditionType,
  matchesByRound: Match[],
) => {
  const ties = Object.groupBy(matchesByRound, (match) => match.tieId!);

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
