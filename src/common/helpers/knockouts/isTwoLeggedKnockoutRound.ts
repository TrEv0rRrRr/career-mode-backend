import { MatchType } from '@prisma/client';
import { isKnockoutMatch } from './isKnockoutMatch.ts';

export const isTwoLeggedKnockoutRound = (
  matchType: MatchType,
  hasTwoLeggedKnockout: boolean,
) =>
  hasTwoLeggedKnockout &&
  isKnockoutMatch(matchType) &&
  matchType !== MatchType.FINAL &&
  matchType !== MatchType.THIRD_PLACE;
