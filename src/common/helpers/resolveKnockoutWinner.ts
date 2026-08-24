import { Competition, Match } from '@prisma/client';
import { resolveTwoLeggedWinner } from './resolveTwoLeggedWinner.ts';

export const resolveKnockoutWinner = (
  competition: Competition,
  matches: Match[],
) => {
  if (competition.hasTwoLeggedKnockout) return resolveTwoLeggedWinner(matches);
};
