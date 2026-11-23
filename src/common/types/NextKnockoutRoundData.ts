import { MatchType } from '@prisma/client';

export type NextKnockoutRoundData =
  | {
      type: MatchType;
      qualifiedClubIds: number[];
    }
  | {
      type: MatchType;
      qualifiedNationalTeamIds: number[];
    };
