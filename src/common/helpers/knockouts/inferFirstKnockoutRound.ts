import { Competition, CompetitionFormat, MatchType } from '@prisma/client';

export const inferFirstKnockoutRound = (competition: Competition) => {
  switch (competition.maxTeamsNumber) {
    case 32:
      return MatchType.ROUND_OF_32;
    case 18:
    case 16:
      if (competition.format === CompetitionFormat.GROUPS_AND_KNOCKOUT)
        return MatchType.GROUP_STAGE;
      return MatchType.ROUND_OF_16;
    case 12:
      return MatchType.GROUP_STAGE;
    case 8:
      return MatchType.QUARTER_FINAL;
    case 4:
      return MatchType.SEMI_FINAL;
    case 2:
      return MatchType.FINAL;
    default:
      throw new Error(
        `Unsupported knockout stage for ${competition.maxTeamsNumber} teams.`,
      );
  }
};
