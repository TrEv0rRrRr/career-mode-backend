import { MatchType } from '@prisma/client';
import { MatchPairing } from '../types/MatchPairing.ts';
import { ParticipatingClub } from '../types/ParticipatingClub.ts';

export const generateSuperCupPairing = (
  clubs: ParticipatingClub[],
): MatchPairing[] => {
  if (clubs.length !== 2) {
    throw new Error('Super Cup pairing requires exactly 2 clubs');
  }

  return [
    {
      homeClubId: clubs[0].club.id,
      awayClubId: clubs[1].club.id,
      matchType: MatchType.FINAL,
    },
  ];
};
