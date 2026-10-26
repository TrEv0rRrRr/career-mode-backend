import { Match, MatchLeg, MatchStatus } from '@prisma/client';

export const resolveTwoLeggedWinner = (matches: Match[]) => {
  if (matches.length != 2)
    throw new Error('A two-legged knockout must have only 2 matches.');

  for (const match of matches)
    if (match.status !== MatchStatus.PLAYED) {
      throw new Error('The match has not been played yet.');
    }

  const firstMatch = matches.find(({ leg }) => leg === MatchLeg.FIRST)!;

  const secondMatch = matches.find(({ leg }) => leg === MatchLeg.SECOND)!;

  const teamAId = firstMatch.homeTeamId;

  const teamBId = firstMatch.awayTeamId;

  const teamAGoals = firstMatch.homeGoals + secondMatch.awayGoals;

  const teamBGoals = firstMatch.awayGoals + secondMatch.homeGoals;

  if (teamAGoals > teamBGoals) return teamAId;

  if (teamBGoals > teamAGoals) return teamBId;

  // Global draw → penalties in the second leg
  if (!secondMatch.winnerTeamId) {
    throw new Error(
      'A tied two-legged knockout must have a winner in the second leg.',
    );
  }

  return secondMatch.winnerTeamId;
};
