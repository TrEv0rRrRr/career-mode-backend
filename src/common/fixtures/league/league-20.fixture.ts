import { MatchType } from '@prisma/client';
import type { MatchPairing } from '../../types/MatchPairing.ts';
import { ParticipatingClub } from '../../types/ParticipatingClub.ts';

export const fixtureByClub: Record<number, number[]> = {
  1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  2: [1, 20, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  3: [19, 1, 2, 20, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  4: [18, 19, 1, 2, 3, 20, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  5: [17, 18, 19, 1, 2, 3, 4, 20, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  6: [16, 17, 18, 19, 1, 2, 3, 4, 5, 20, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  7: [15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 20, 8, 9, 10, 11, 12, 13, 14],
  8: [14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 20, 9, 10, 11, 12, 13],
  9: [13, 14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 8, 20, 10, 11, 12],
  10: [12, 13, 14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 11],
  11: [20, 12, 13, 14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  12: [10, 11, 20, 13, 14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  13: [9, 10, 11, 12, 20, 14, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7, 8],
  14: [8, 9, 10, 11, 12, 13, 20, 15, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6, 7],
  15: [7, 8, 9, 10, 11, 12, 13, 14, 20, 16, 17, 18, 19, 1, 2, 3, 4, 5, 6],
  16: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 17, 18, 19, 1, 2, 3, 4, 5],
  17: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 18, 19, 1, 2, 3, 4],
  18: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 19, 1, 2, 3],
  19: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 1, 2],
  20: [11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9, 19, 10, 1],
};

const getRivalPosition = (position: number, matchday: number) =>
  fixtureByClub[position][matchday - 1];

const addReturnLeg = (
  firstLegFixture: MatchPairing[],
  firstLegMatchdayCount: number,
): MatchPairing[] => [
  ...firstLegFixture,
  ...firstLegFixture.map((match) => ({
    ...match,
    homeClubId: match.awayClubId,
    awayClubId: match.homeClubId,
    matchday: (match.matchday ?? 0) + firstLegMatchdayCount,
  })),
];

export const generateLeagueFixture = (
  participatingClubs: ParticipatingClub[],
): MatchPairing[] => {
  const orderedClubs = [...participatingClubs].sort(
    (first, second) =>
      (first.position ?? Number.MAX_SAFE_INTEGER) -
        (second.position ?? Number.MAX_SAFE_INTEGER) ||
      first.club.id - second.club.id,
  );
  const positions = orderedClubs.map(({ position }) => position);
  const hasCompleteTwentyClubRanking =
    orderedClubs.length === 20 &&
    positions.every(
      (position): position is number =>
        position !== null && position >= 1 && position <= 20,
    ) &&
    new Set(positions).size === 20;

  if (hasCompleteTwentyClubRanking) {
    const clubIdsByPosition = orderedClubs.map(({ club }) => club.id);
    const fixture: MatchPairing[] = [];

    for (let matchday = 1; matchday <= 19; matchday++) {
      for (let position = 1; position <= 20; position++) {
        const rivalPosition = getRivalPosition(position, matchday);

        if (position < rivalPosition) {
          fixture.push({
            matchday,
            homeClubId: clubIdsByPosition[position - 1],
            awayClubId: clubIdsByPosition[rivalPosition - 1],
            matchType: MatchType.LEAGUE,
          });
        }
      }
    }

    return addReturnLeg(fixture, 19);
  }

  const rotatingClubs: (number | null)[] = orderedClubs.map(
    ({ club }) => club.id,
  );

  if (rotatingClubs.length % 2 !== 0) rotatingClubs.push(null);

  const fixture: MatchPairing[] = [];
  const rounds = rotatingClubs.length - 1;

  for (let roundIndex = 0; roundIndex < rounds; roundIndex++) {
    for (
      let pairingIndex = 0;
      pairingIndex < rotatingClubs.length / 2;
      pairingIndex++
    ) {
      const firstClubId = rotatingClubs[pairingIndex];
      const secondClubId =
        rotatingClubs[rotatingClubs.length - 1 - pairingIndex];

      if (firstClubId === null || secondClubId === null) continue;

      const swapHomeAndAway = (roundIndex + pairingIndex) % 2 !== 0;

      fixture.push({
        homeClubId: swapHomeAndAway ? secondClubId : firstClubId,
        awayClubId: swapHomeAndAway ? firstClubId : secondClubId,
        matchday: roundIndex + 1,
        matchType: MatchType.LEAGUE,
      });
    }

    const lastClub = rotatingClubs.pop()!;
    rotatingClubs.splice(1, 0, lastClub);
  }

  return addReturnLeg(fixture, rounds);
};
