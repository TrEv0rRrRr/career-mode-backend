import { MatchType } from '@prisma/client';

export const isKnockoutMatch = (matchType: MatchType) => {
  return matchType !== MatchType.LEAGUE && matchType !== MatchType.GROUP_STAGE;
};
