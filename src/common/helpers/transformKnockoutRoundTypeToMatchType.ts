import { MatchType } from '@prisma/client';
import { KnockoutRoundType } from '../../knockout-round/enums/KnockoutRoundType.ts';

/**
 * Converts a knockout round type to its corresponding match type.
 *
 * @param type - The knockout round type to convert.
 * @returns The corresponding match type.
 * @author Trevor
 */
export const transformKnockoutRoundTypeToMatchType = (
  type: KnockoutRoundType,
): MatchType => {
  switch (type) {
    case KnockoutRoundType.ROUND_OF_32:
      return MatchType.ROUND_OF_32;
    case KnockoutRoundType.ROUND_OF_16:
      return MatchType.ROUND_OF_16;
    case KnockoutRoundType.QUARTER_FINAL:
      return MatchType.QUARTER_FINAL;
    case KnockoutRoundType.SEMI_FINAL:
      return MatchType.SEMI_FINAL;
    case KnockoutRoundType.THIRD_PLACE:
      return MatchType.THIRD_PLACE;
    case KnockoutRoundType.FINAL:
      return MatchType.FINAL;
  }
};

/**
 * Converts a match type to its corresponding knockout round type.
 *
 * @param type - The match type to convert.
 * @returns The corresponding knockout round type.
 * @author Trevor
 */
export const transformMatchTypeToKnockoutRoundType = (
  type: MatchType,
): KnockoutRoundType => {
  switch (type) {
    case MatchType.ROUND_OF_32:
      return KnockoutRoundType.ROUND_OF_32;
    case MatchType.ROUND_OF_16:
      return KnockoutRoundType.ROUND_OF_16;
    case MatchType.QUARTER_FINAL:
      return KnockoutRoundType.QUARTER_FINAL;
    case MatchType.SEMI_FINAL:
      return KnockoutRoundType.SEMI_FINAL;
    case MatchType.THIRD_PLACE:
      return KnockoutRoundType.THIRD_PLACE;
    case MatchType.FINAL:
      return KnockoutRoundType.FINAL;
    default:
      throw new Error(`Match type ${type} is not a knockout round`);
  }
};
