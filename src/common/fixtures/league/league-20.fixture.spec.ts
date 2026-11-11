import { MatchType } from '@prisma/client';
import { ParticipatingTeam } from '../../types/ParticipatingTeams.ts';
import { generateLeagueFixture } from './league-20.fixture.ts';

const createParticipants = (teamIds: number[]): ParticipatingTeam[] =>
  teamIds.map((id) => ({
    team: { id } as ParticipatingTeam['team'],
    position: null,
  }));

describe('generateLeagueFixture', () => {
  it('generates a complete fixture for four participants without positions', () => {
    const fixture = generateLeagueFixture(createParticipants([4, 2, 1, 3]));

    expect(fixture).toHaveLength(12);
    expect(
      fixture.every(({ matchType }) => matchType === MatchType.LEAGUE),
    ).toBe(true);
    expect(new Set(fixture.map(({ matchday }) => matchday)).size).toBe(6);

    const pairings = new Map<string, number>();

    for (const { homeTeamId, awayTeamId } of fixture) {
      const key = [homeTeamId, awayTeamId].sort().join('-');
      pairings.set(key, (pairings.get(key) ?? 0) + 1);
    }

    expect(pairings.size).toBe(6);
    expect([...pairings.values()].every((count) => count === 2)).toBe(true);
  });

  it('uses the 20-team schedule for both legs when all positions are set', () => {
    const participants = Array.from({ length: 20 }, (_, index) => ({
      team: { id: index + 1 } as ParticipatingTeam['team'],
      position: index + 1,
    }));
    const fixture = generateLeagueFixture(participants);

    expect(fixture).toHaveLength(380);
    expect(new Set(fixture.map(({ matchday }) => matchday)).size).toBe(38);

    for (const firstLegMatch of fixture.filter(
      ({ matchday }) => matchday! <= 19,
    )) {
      expect(
        fixture.some(
          (returnMatch) =>
            returnMatch.matchday === firstLegMatch.matchday! + 19 &&
            returnMatch.homeTeamId === firstLegMatch.awayTeamId &&
            returnMatch.awayTeamId === firstLegMatch.homeTeamId,
        ),
      ).toBe(true);
    }
  });
});
