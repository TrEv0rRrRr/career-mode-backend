import { BadRequestException } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import type { MatchPairing } from '../../types/MatchPairing.ts';

const createSingleRoundRobin = (teamIds: number[]) => {
  const teams: (number | null)[] = [...teamIds];

  if (teams.length % 2 !== 0) teams.push(null);

  const rounds: [number, number][][] = [];

  for (let round = 0; round < teams.length - 1; round++) {
    const pairings: [number, number][] = [];

    for (let index = 0; index < teams.length / 2; index++) {
      const first = teams[index];
      const second = teams[teams.length - 1 - index];

      if (first !== null && second !== null) {
        pairings.push([first, second]);
      }
    }

    rounds.push(pairings);
    teams.splice(1, 0, teams.pop()!);
  }

  return rounds;
};

export const generateGroupFixture = (
  groups: Record<string, number[]>,
  matchdays: number[],
): MatchPairing[] => {
  const teamsPerGroup = Object.values(groups)[0]?.length;

  if (!teamsPerGroup || matchdays.length === 0) {
    throw new BadRequestException(
      'Groups and group-stage matchdays are required to generate a fixture.',
    );
  }

  if (
    Object.values(groups).some((teamIds) => teamIds.length !== teamsPerGroup)
  ) {
    throw new BadRequestException(
      'Every group must contain the same number of teams.',
    );
  }

  if (new Set(matchdays).size !== matchdays.length) {
    throw new BadRequestException(
      'Group-stage calendar matchdays must be unique.',
    );
  }

  const singleRoundMatchdays =
    teamsPerGroup % 2 === 0 ? teamsPerGroup - 1 : teamsPerGroup;
  const isDoubleRoundRobin = matchdays.length === singleRoundMatchdays * 2;

  if (matchdays.length !== singleRoundMatchdays && !isDoubleRoundRobin) {
    throw new BadRequestException(
      `The calendar must define ${singleRoundMatchdays} or ${singleRoundMatchdays * 2} group-stage matchdays for groups of ${teamsPerGroup}.`,
    );
  }

  return Object.values(groups).flatMap((teamIds) => {
    const firstLeg = createSingleRoundRobin(teamIds).map((round, roundIndex) =>
      round.map(([firstTeamId, secondTeamId], pairingIndex) =>
        (roundIndex + pairingIndex) % 2 === 0
          ? ([firstTeamId, secondTeamId] as [number, number])
          : ([secondTeamId, firstTeamId] as [number, number]),
      ),
    );
    const rounds = isDoubleRoundRobin
      ? [
          ...firstLeg,
          ...firstLeg.map((round) =>
            round.map(([home, away]) => [away, home] as [number, number]),
          ),
        ]
      : firstLeg;

    return rounds.flatMap((round, roundIndex) =>
      round.map(([homeTeamId, awayTeamId]) => ({
        homeTeamId,
        awayTeamId,
        matchType: MatchType.GROUP_STAGE,
        matchday: matchdays[roundIndex],
      })),
    );
  });
};
