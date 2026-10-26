import { MatchType } from '@prisma/client';

export const getNextKnockoutRounds = (
  currentRound: MatchType,
  hasThirdPlaceMatch: boolean,
): MatchType[] => {
  switch (currentRound) {
    case MatchType.ROUND_OF_32:
      return [MatchType.ROUND_OF_16];

    case MatchType.ROUND_OF_16:
      return [MatchType.QUARTER_FINAL];

    case MatchType.QUARTER_FINAL:
      return [MatchType.SEMI_FINAL];

    case MatchType.SEMI_FINAL:
      return hasThirdPlaceMatch
        ? [MatchType.FINAL, MatchType.THIRD_PLACE]
        : [MatchType.FINAL];

    case MatchType.FINAL:
    case MatchType.THIRD_PLACE:
      return [];

    default:
      throw new Error(`Match type ${currentRound} is not a knockout round.`);
  }
};
