import { MatchLeg } from '@prisma/client';
import { MatchPairing } from '../../types/MatchPairing.ts';

/**
 * Method that creates the brackets for a knockout depending on whether the competition format admits 2Leg Knockouts or not
 * @author Trevor
 *
 * @param {Pick<MatchPairing, 'homeTeamId' | 'awayTeamId' | 'matchType'>} pairing This contains the pairings using only the team ids
 * @param {boolean} isTwoLegged Parameter that determines whether to create 2Leg knockout matches or a single match per bracket
 * @returns {MatchPairing[]} An array containing the new pairings
 */
export const generateKnockoutBracket = (
  pairing: Pick<MatchPairing, 'homeTeamId' | 'awayTeamId' | 'matchType'>,
  isTwoLegged: boolean,
): MatchPairing[] => {
  if (pairing.homeTeamId === pairing.awayTeamId) {
    throw new Error('A team cannot play against itself');
  }

  if (!isTwoLegged) {
    return [{ ...pairing }];
  }

  return [
    {
      ...pairing,
      leg: MatchLeg.FIRST,
    },
    {
      ...pairing,
      homeTeamId: pairing.awayTeamId,
      awayTeamId: pairing.homeTeamId,
      leg: MatchLeg.SECOND,
    },
  ];
};
