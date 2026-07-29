import { MatchType, Team } from '@prisma/client';
import { MatchPairing } from '../../types/MatchPairing.ts';

export const generateGroupFixture = (groupTeams: Team[]): MatchPairing[][] => {
  if (groupTeams.length !== 4) {
    throw new Error('A group must contain exactly 4 teams');
  }

  const teamA = 0;
  const teamB = 1;
  const teamC = 2;
  const teamD = 3;

  return [
    [
      {
        homeTeamId: groupTeams[teamA].id,
        awayTeamId: groupTeams[teamB].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 1,
      },
      {
        homeTeamId: groupTeams[teamC].id,
        awayTeamId: groupTeams[teamD].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 1,
      },
    ],
    [
      {
        homeTeamId: groupTeams[teamA].id,
        awayTeamId: groupTeams[teamC].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 2,
      },
      {
        homeTeamId: groupTeams[teamD].id,
        awayTeamId: groupTeams[teamB].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 2,
      },
    ],
    [
      {
        homeTeamId: groupTeams[teamA].id,
        awayTeamId: groupTeams[teamD].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 3,
      },
      {
        homeTeamId: groupTeams[teamB].id,
        awayTeamId: groupTeams[teamC].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 3,
      },
    ],
    [
      {
        homeTeamId: groupTeams[teamB].id,
        awayTeamId: groupTeams[teamA].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 4,
      },
      {
        homeTeamId: groupTeams[teamD].id,
        awayTeamId: groupTeams[teamC].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 4,
      },
    ],
    [
      {
        homeTeamId: groupTeams[teamC].id,
        awayTeamId: groupTeams[teamA].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 5,
      },
      {
        homeTeamId: groupTeams[teamB].id,
        awayTeamId: groupTeams[teamD].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 5,
      },
    ],
    [
      {
        homeTeamId: groupTeams[teamD].id,
        awayTeamId: groupTeams[teamA].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 6,
      },
      {
        homeTeamId: groupTeams[teamC].id,
        awayTeamId: groupTeams[teamB].id,
        matchType: MatchType.GROUP_STAGE,
        matchday: 6,
      },
    ],
  ];
};
