import { MatchType } from '@prisma/client';

export type NextKnockoutRoundData = {
  type: MatchType;
  qualifiedClubIds: number[];
};
