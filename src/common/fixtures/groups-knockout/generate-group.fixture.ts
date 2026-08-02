import { MatchType } from '@prisma/client';
import { MatchPairing } from '../../types/MatchPairing.ts';
import { ParticipatingTeam } from '../../types/ParticipatingTeams.ts';

export const generateGroupFixture = (
  groupTeams: ParticipatingTeam[],
): MatchPairing[] => {
  if (groupTeams.length !== 4) {
    throw new Error('A group must contain exactly 4 teams');
  }

  const teamA = 0;
  const teamB = 1;
  const teamC = 2;
  const teamD = 3;

  return [
    {
      homeTeamId: groupTeams[teamA].team.id,
      awayTeamId: groupTeams[teamB].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 1,
    },
    {
      homeTeamId: groupTeams[teamC].team.id,
      awayTeamId: groupTeams[teamD].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 1,
    },

    {
      homeTeamId: groupTeams[teamA].team.id,
      awayTeamId: groupTeams[teamC].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 2,
    },
    {
      homeTeamId: groupTeams[teamD].team.id,
      awayTeamId: groupTeams[teamB].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 2,
    },

    {
      homeTeamId: groupTeams[teamA].team.id,
      awayTeamId: groupTeams[teamD].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 3,
    },
    {
      homeTeamId: groupTeams[teamB].team.id,
      awayTeamId: groupTeams[teamC].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 3,
    },

    {
      homeTeamId: groupTeams[teamB].team.id,
      awayTeamId: groupTeams[teamA].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 4,
    },
    {
      homeTeamId: groupTeams[teamD].team.id,
      awayTeamId: groupTeams[teamC].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 4,
    },

    {
      homeTeamId: groupTeams[teamC].team.id,
      awayTeamId: groupTeams[teamA].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 5,
    },
    {
      homeTeamId: groupTeams[teamB].team.id,
      awayTeamId: groupTeams[teamD].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 5,
    },

    {
      homeTeamId: groupTeams[teamD].team.id,
      awayTeamId: groupTeams[teamA].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 6,
    },
    {
      homeTeamId: groupTeams[teamC].team.id,
      awayTeamId: groupTeams[teamB].team.id,
      matchType: MatchType.GROUP_STAGE,
      matchday: 6,
    },
  ];
};
