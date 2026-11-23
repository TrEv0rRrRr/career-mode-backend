import { Match, MatchFinishType, MatchLeg, MatchStatus } from '@prisma/client';

export const resolveTwoLeggedWinner = (matches: Match[]) => {
  if (matches.length != 2)
    throw new Error('A two-legged knockout must have only 2 matches.');

  for (const match of matches) {
    if (match.status !== MatchStatus.PLAYED) {
      throw new Error('The match has not been played yet.');
    }

    if (
      match.leg === MatchLeg.FIRST &&
      match.finishType !== MatchFinishType.REGULAR_TIME
    )
      throw new Error('The first leg must end in regular time');
  }

  const firstMatch = matches.find(({ leg }) => leg === MatchLeg.FIRST)!;

  const secondMatch = matches.find(({ leg }) => leg === MatchLeg.SECOND)!;

  const teamAId = firstMatch.homeNationalTeamId ?? firstMatch.homeClubId;
  const teamBId = firstMatch.awayNationalTeamId ?? firstMatch.awayClubId;
  const secondHomeId = secondMatch.homeNationalTeamId ?? secondMatch.homeClubId;
  const secondAwayId = secondMatch.awayNationalTeamId ?? secondMatch.awayClubId;

  if (
    teamAId === null ||
    teamBId === null ||
    secondHomeId === null ||
    secondAwayId === null ||
    secondHomeId === secondAwayId ||
    ![teamAId, teamBId].includes(secondHomeId) ||
    ![teamAId, teamBId].includes(secondAwayId)
  ) {
    throw new Error('Two-legged knockout matches must have two participants.');
  }

  const teamAGoals =
    firstMatch.homeGoals +
    (secondHomeId === teamAId ? secondMatch.homeGoals : secondMatch.awayGoals);

  const teamBGoals =
    firstMatch.awayGoals +
    (secondHomeId === teamBId ? secondMatch.homeGoals : secondMatch.awayGoals);

  if (teamAGoals > teamBGoals) return teamAId;

  if (teamBGoals > teamAGoals) return teamBId;

  // Global draw → penalties in the second leg
  const secondLegWinnerId =
    secondMatch.winnerNationalTeamId ?? secondMatch.winnerClubId;
  if (secondLegWinnerId === null) {
    throw new Error(
      'A tied two-legged knockout must have a winner in the second leg.',
    );
  }

  return secondLegWinnerId;
};
