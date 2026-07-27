import { Competition, MatchType } from '@prisma/client';

export const inferMatchType = (
  competition: Competition,
  remainingTeams: number,
) => {
  switch (remainingTeams) {
    case 32:
      return MatchType.ROUND_OF_32;
    case 16:
      return MatchType.ROUND_OF_16;
    case 8:
      return MatchType.QUARTER_FINAL;
    case 4:
      return MatchType.SEMI_FINAL;
    case 2:
      return MatchType.FINAL;
    default:
      throw new Error(
        `Unsupported knockout stage for ${remainingTeams} teams.`,
      );
  }
};
