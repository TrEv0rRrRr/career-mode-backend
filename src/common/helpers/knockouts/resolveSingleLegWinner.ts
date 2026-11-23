import { Match, MatchStatus } from '@prisma/client';

export const resolveSingleLegWinner = (match: Match): number => {
  if (match.status !== MatchStatus.PLAYED) {
    throw new Error('The match has not been played yet.');
  }

  if (match.winnerClubId === null) {
    throw new Error('A knockout match must have a winner.');
  }

  return match.winnerClubId;
};
