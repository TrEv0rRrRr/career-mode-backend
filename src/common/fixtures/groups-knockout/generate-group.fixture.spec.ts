import { BadRequestException } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { generateGroupFixture } from './generate-group.fixture.ts';

describe('generateGroupFixture', () => {
  const groups = { A: [1, 2, 3, 4], B: [5, 6, 7, 8] };

  it('generates one round-robin match per pair for each group', () => {
    const fixture = generateGroupFixture(groups, [1, 2, 3]);

    expect(fixture).toHaveLength(12);
    expect(
      fixture.every((match) => match.matchType === MatchType.GROUP_STAGE),
    ).toBe(true);

    for (const teamIds of Object.values(groups)) {
      const groupMatches = fixture.filter(
        (match) =>
          teamIds.includes(match.homeTeamId) &&
          teamIds.includes(match.awayTeamId),
      );
      const uniquePairings = new Set(
        groupMatches.map((match) =>
          [match.homeTeamId, match.awayTeamId].sort().join('-'),
        ),
      );

      expect(groupMatches).toHaveLength(6);
      expect(uniquePairings.size).toBe(6);
    }
  });

  it('generates a return fixture with reversed home and away teams', () => {
    const fixture = generateGroupFixture(groups, [1, 2, 3, 4, 5, 6]);
    const matchesByPair = new Map<string, typeof fixture>();

    for (const match of fixture) {
      const key = [match.homeTeamId, match.awayTeamId].sort().join('-');
      matchesByPair.set(key, [...(matchesByPair.get(key) ?? []), match]);
    }

    expect(fixture).toHaveLength(24);
    expect([...matchesByPair.values()]).toHaveLength(12);

    for (const matches of matchesByPair.values()) {
      expect(matches).toHaveLength(2);
      expect(matches[0].homeTeamId).toBe(matches[1].awayTeamId);
      expect(matches[0].awayTeamId).toBe(matches[1].homeTeamId);
    }
  });

  it('rejects calendars with an unsupported number of group matchdays', () => {
    expect(() => generateGroupFixture(groups, [1, 2])).toThrow(
      BadRequestException,
    );
  });
});
