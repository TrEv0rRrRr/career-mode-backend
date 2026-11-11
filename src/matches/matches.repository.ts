import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompetitionFormat,
  CompetitionParticipant,
  Match,
  MatchFinishType,
  MatchStatus,
  MatchType,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { recalculateStandings } from '../common/helpers/gp-leagues/recalculateStandings.ts';
import { isKnockoutMatch } from '../common/helpers/knockouts/isKnockoutMatch.ts';
import { resolveKnockoutWinners } from '../common/helpers/knockouts/resolveKnockoutWinners.ts';
import { StandingTeam } from '../common/types/StandingTeam.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';

type fairPlayStatsType = (Prisma.PickEnumerable<
  Prisma.MatchPlayerStatsGroupByOutputType,
  'teamId'[]
> & {
  _sum: {
    redCards: number | null;
    yellowCards: number | null;
  };
})[];

type txType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
>;

@Injectable()
export class MatchesRepository {
  constructor(private prisma: PrismaService) {}

  findOne(matchId: number) {
    return this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        matchTeamStats: true,
        matchPlayerStats: true,
        stadium: true,
      },
    });
  }

  findMatchesByRound(competitionEditionId: number, matchType: MatchType) {
    return this.prisma.match.findMany({
      where: {
        competitionEditionId,
        type: matchType,
      },
    });
  }

  findMatchesByTieId(tieId: number) {
    return this.prisma.tie.findUnique({
      where: {
        id: tieId,
      },
      include: {
        matches: true,
      },
    });
  }

  countByCompetitionEdition(competitionEditionId: number) {
    return this.prisma.match.count({ where: { competitionEditionId } });
  }

  create(competitionEditionId: number, type: MatchType, data: CreateMatchDto) {
    const matchData = {
      ...data,
      competitionEditionId,
      type,
      status: MatchStatus.SCHEDULED,
      homeGoals: 0,
      awayGoals: 0,
      homePenaltyGoals: null,
      awayPenaltyGoals: null,
      finishType: null,
    };

    return this.prisma.match.create({
      data: matchData,
    });
  }

  createMany(
    competitionEditionId: number,
    type: MatchType,
    data: CreateMatchDto[],
  ) {
    if (isKnockoutMatch(type)) {
      throw new BadRequestException(
        'Use createKnockoutRoundMatches to create knockout matches.',
      );
    }

    const matchData = data.map((match) => ({
      ...match,
      type,
      status: MatchStatus.SCHEDULED,
      homeGoals: 0,
      awayGoals: 0,
      homePenaltyGoals: null,
      awayPenaltyGoals: null,
      finishType: null,
      tieId: null,
      competitionEditionId,
    }));

    return this.prisma.match.createMany({ data: matchData });
  }

  async createKnockoutRoundMatches(
    knockoutRoundId: number,
    competitionEditionId: number,
    type: MatchType,
    ties: CreateMatchDto[][],
  ) {
    return this.prisma.$transaction(async (tx) => {
      for (const matches of ties) {
        const tie = await tx.tie.create({
          data: { knockoutRoundId },
        });

        await tx.match.createMany({
          data: matches.map((match) => ({
            ...match,
            tieId: tie.id,
            competitionEditionId,
            type,
            status: MatchStatus.SCHEDULED,
          })),
        });
      }
    });
  }

  async createGroupStageMatches(
    competitionEditionId: number,
    groups: Record<string, number[]>,
    matches: CreateMatchDto[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      for (const [group, teamIds] of Object.entries(groups)) {
        const updatedParticipants = await tx.competitionParticipant.updateMany({
          where: {
            competitionEditionId,
            teamId: { in: teamIds },
          },
          data: {
            group,
            position: null,
            points: 0,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gf: 0,
            ga: 0,
            gd: 0,
          },
        });

        if (updatedParticipants.count !== teamIds.length) {
          throw new BadRequestException(
            'A group contains teams that do not participate in this competition edition.',
          );
        }
      }

      return tx.match.createMany({
        data: matches.map((match) => ({
          ...match,
          type: MatchType.GROUP_STAGE,
          status: MatchStatus.SCHEDULED,
          homeGoals: 0,
          awayGoals: 0,
          homePenaltyGoals: null,
          awayPenaltyGoals: null,
          finishType: null,
          tieId: null,
          competitionEditionId,
        })),
      });
    });
  }

  async recalculateLeagueStandings(
    matches: Match[],
    competitionParticipants: CompetitionParticipant[],
    fairPlayStats: fairPlayStatsType,
    competitionEditionId: number,
    tx: txType,
  ) {
    const participants: StandingTeam[] = competitionParticipants.map(
      (participant) => {
        const fairPlay = fairPlayStats.find(
          (stat) => stat.teamId === participant.teamId,
        );

        if (participant.points === null) {
          throw new Error(
            'A competition participant with standings must have points.',
          );
        }

        return {
          teamId: participant.teamId,
          points: participant.points,
          group: participant.group,
          gf: participant.gf,
          ga: participant.ga,
          gd: participant.gd,
          redCards: fairPlay?._sum.redCards || 0,
          yellowCards: fairPlay?._sum.yellowCards || 0,
        };
      },
    );

    const standings = recalculateStandings(participants, matches);

    for (const [index, team] of standings.entries()) {
      await tx.competitionParticipant.update({
        where: {
          teamId_competitionEditionId: {
            teamId: team.teamId,
            competitionEditionId,
          },
        },
        data: {
          position: index + 1,
        },
      });
    }
  }

  async recalculateGroupStandings(
    matches: Match[],
    groups: string[],
    competitionParticipants: CompetitionParticipant[],
    competitionEditionId: number,
    fairPlayStats: fairPlayStatsType,
    tx: txType,
  ) {
    for (const group of groups) {
      const groupParticipants = competitionParticipants.filter(
        (participant) => participant.group === group,
      );

      const groupTeamIds = new Set(
        groupParticipants.map(({ teamId }) => teamId),
      );

      const groupMatches = matches.filter(
        (match) =>
          groupTeamIds.has(match.homeTeamId) &&
          groupTeamIds.has(match.awayTeamId) &&
          match.type === MatchType.GROUP_STAGE,
      );

      const participants: StandingTeam[] = groupParticipants.map(
        (participant) => {
          const fairPlay = fairPlayStats.find(
            (stats) => stats.teamId === participant.teamId,
          );

          if (participant.points === null) {
            throw new Error('A group participant must have points.');
          }

          return {
            teamId: participant.teamId,
            points: participant.points,
            gf: participant.gf,
            ga: participant.ga,
            gd: participant.gd,
            redCards: fairPlay?._sum.redCards ?? 0,
            yellowCards: fairPlay?._sum.yellowCards ?? 0,
          };
        },
      );

      const standings = recalculateStandings(participants, groupMatches);

      for (const [index, team] of standings.entries()) {
        await tx.competitionParticipant.update({
          where: {
            teamId_competitionEditionId: {
              teamId: team.teamId,
              competitionEditionId,
            },
          },
          data: {
            position: index + 1,
          },
        });
      }
    }
  }

  playMatch(
    matchId: number,
    competitionFormat: CompetitionFormat,
    playerTeamsIds: Map<number, number>,
    seasonId: number,
    winnerTeamId: number | null,
    data: PlayMatchDto,
    finishType: MatchFinishType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          ...data.match,
          finishType,
          status: MatchStatus.PLAYED,
          winnerTeamId,
        },
      });

      await tx.matchPlayerStats.createMany({
        data: data.playerStats.map((stats) => ({
          ...stats,
          matchId,
          teamId: playerTeamsIds.get(stats.playerId)!,
        })),
      });

      await tx.matchTeamStats.createMany({
        data: data.teamStats.map((stats) => ({
          ...stats,
          matchId,
        })),
      });

      for (const stats of data.playerStats) {
        const playerId = stats.playerId;
        const teamId = playerTeamsIds.get(playerId)!;

        const currentStats = await tx.playerSeasonStats.findUnique({
          where: {
            playerId_teamId_seasonId: {
              playerId,
              teamId,
              seasonId,
            },
          },
        });

        const newRating = currentStats
          ? (Number(currentStats.rating) * currentStats.matches +
              stats.rating) /
            (currentStats.matches + 1)
          : stats.rating;

        await tx.playerSeasonStats.upsert({
          where: {
            playerId_teamId_seasonId: {
              playerId,
              teamId,
              seasonId,
            },
          },
          create: {
            playerId,
            teamId,
            seasonId,
            matches: 1,
            assists: stats.assists,
            goals: stats.goals,
            rating: stats.rating,
            redCards: stats.redCards,
            yellowCards: stats.yellowCards,
          },
          update: {
            matches: { increment: 1 },
            goals: { increment: stats.goals },
            assists: { increment: stats.assists },
            yellowCards: { increment: stats.yellowCards },
            redCards: { increment: stats.redCards },
            rating: newRating,
          },
        });
      }

      const isHomeWinner = data.match.homeGoals > data.match.awayGoals;

      const isDraw = data.match.homeGoals === data.match.awayGoals;

      const isAwayWinner = data.match.awayGoals > data.match.homeGoals;

      const updateHomeTeamSeasonStats = {
        played: { increment: 1 },
        wins: { increment: isHomeWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isAwayWinner ? 1 : 0 },
        gf: { increment: data.match.homeGoals },
        ga: { increment: data.match.awayGoals },
        gd: { increment: data.match.homeGoals - data.match.awayGoals },
      };

      const updateAwayTeamSeasonStats = {
        played: { increment: 1 },
        wins: { increment: isAwayWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isHomeWinner ? 1 : 0 },
        gf: { increment: data.match.awayGoals },
        ga: { increment: data.match.homeGoals },
        gd: { increment: data.match.awayGoals - data.match.homeGoals },
      };

      const homeTeamId = updatedMatch.homeTeamId;
      const awayTeamId = updatedMatch.awayTeamId;

      await tx.teamSeasonStats.upsert({
        where: {
          teamId_seasonId: {
            teamId: homeTeamId,
            seasonId,
          },
        },
        create: {
          teamId: homeTeamId,
          seasonId,
          played: 1,
          wins: isHomeWinner ? 1 : 0,
          draws: isDraw ? 1 : 0,
          losses: isAwayWinner ? 1 : 0,
          gf: data.match.homeGoals,
          ga: data.match.awayGoals,
          gd: data.match.homeGoals - data.match.awayGoals,
        },
        update: updateHomeTeamSeasonStats,
      });

      await tx.teamSeasonStats.upsert({
        where: {
          teamId_seasonId: {
            teamId: awayTeamId,
            seasonId,
          },
        },
        create: {
          teamId: awayTeamId,
          seasonId,
          played: 1,
          wins: isAwayWinner ? 1 : 0,
          draws: isDraw ? 1 : 0,
          losses: isHomeWinner ? 1 : 0,
          gf: data.match.awayGoals,
          ga: data.match.homeGoals,
          gd: data.match.awayGoals - data.match.homeGoals,
        },
        update: updateAwayTeamSeasonStats,
      });

      const competitionEditionId = updatedMatch.competitionEditionId;

      const usesStandings =
        (competitionFormat === CompetitionFormat.LEAGUE &&
          updatedMatch.type === MatchType.LEAGUE) ||
        (competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT &&
          updatedMatch.type === MatchType.GROUP_STAGE);

      const homeParticipantUpdate = {
        ...(usesStandings && {
          played: { increment: 1 },
          wins: { increment: isHomeWinner ? 1 : 0 },
          draws: { increment: isDraw ? 1 : 0 },
          losses: { increment: isAwayWinner ? 1 : 0 },
          gf: { increment: data.match.homeGoals },
          ga: { increment: data.match.awayGoals },
          gd: { increment: data.match.homeGoals - data.match.awayGoals },
          points: {
            increment: isHomeWinner ? 3 : isDraw ? 1 : 0,
          },
        }),
      };

      const awayParticipantUpdate = {
        ...(usesStandings && {
          played: { increment: 1 },
          wins: { increment: isAwayWinner ? 1 : 0 },
          draws: { increment: isDraw ? 1 : 0 },
          losses: { increment: isHomeWinner ? 1 : 0 },
          gf: { increment: data.match.awayGoals },
          ga: { increment: data.match.homeGoals },
          gd: { increment: data.match.awayGoals - data.match.homeGoals },
          points: {
            increment: isAwayWinner ? 3 : isDraw ? 1 : 0,
          },
        }),
      };

      await tx.competitionParticipant.update({
        where: {
          teamId_competitionEditionId: {
            teamId: homeTeamId,
            competitionEditionId,
          },
        },
        data: homeParticipantUpdate,
      });

      await tx.competitionParticipant.update({
        where: {
          teamId_competitionEditionId: {
            teamId: awayTeamId,
            competitionEditionId,
          },
        },
        data: awayParticipantUpdate,
      });

      const matches = await tx.match.findMany({
        where: { competitionEditionId, status: MatchStatus.PLAYED },
      });

      const standingsMatchType =
        competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT
          ? MatchType.GROUP_STAGE
          : MatchType.LEAGUE;
      const matchIds = matches
        .filter((match) => match.type === standingsMatchType)
        .map(({ id }) => id);

      const competitionParticipants = await tx.competitionParticipant.findMany({
        where: { competitionEditionId },
      });

      const fairPlayStats = await tx.matchPlayerStats.groupBy({
        by: ['teamId'],
        where: {
          matchId: {
            in: matchIds,
          },
        },
        _sum: {
          redCards: true,
          yellowCards: true,
        },
      });

      const groups = [
        ...new Set(
          competitionParticipants
            .map((participant) => participant.group)
            .filter((group): group is string => group !== null),
        ),
      ];

      if (competitionFormat === CompetitionFormat.LEAGUE) {
        await this.recalculateLeagueStandings(
          matches,
          competitionParticipants,
          fairPlayStats,
          competitionEditionId,
          tx,
        );
      }

      if (
        competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT &&
        updatedMatch.type === MatchType.GROUP_STAGE
      ) {
        await this.recalculateGroupStandings(
          matches,
          groups,
          competitionParticipants,
          competitionEditionId,
          fairPlayStats,
          tx,
        );
        await this.finalizeGroupStageIfComplete(
          tx,
          competitionEditionId,
          fairPlayStats,
        );
      }

      const matchesByRound = await tx.match.findMany({
        where: {
          competitionEditionId,
          type: updatedMatch.type,
        },
      });

      const edition = await tx.competitionEdition.findFirst({
        where: { id: competitionEditionId },
        select: {
          competition: true,
        },
      });

      const roundFinished = matchesByRound.every(
        (match) => match.status === MatchStatus.PLAYED,
      );

      if (isKnockoutMatch(updatedMatch.type) && roundFinished) {
        resolveKnockoutWinners(edition, matchesByRound);
      }

      return updatedMatch;
    });
  }

  private async finalizeGroupStageIfComplete(
    tx: txType,
    competitionEditionId: number,
    fairPlayStats: fairPlayStatsType,
  ) {
    const groupStageMatches = await tx.match.findMany({
      where: {
        competitionEditionId,
        type: MatchType.GROUP_STAGE,
      },
      select: { status: true },
    });

    if (
      groupStageMatches.length === 0 ||
      !groupStageMatches.every(({ status }) => status === MatchStatus.PLAYED)
    )
      return;

    const edition = await tx.competitionEdition.findUniqueOrThrow({
      where: { id: competitionEditionId },
      select: {
        seasonId: true,
        competition: {
          select: {
            name: true,
            groups: true,
            teamsPerGroup: true,
          },
        },
      },
    });
    const participants = await tx.competitionParticipant.findMany({
      where: {
        competitionEditionId,
        group: { not: null },
      },
    });
    const groupedParticipants = new Map<string, CompetitionParticipant[]>();

    for (const participant of participants) {
      if (participant.group === null) continue;

      const group = groupedParticipants.get(participant.group) ?? [];
      group.push(participant);
      groupedParticipants.set(participant.group, group);
    }

    const isThreeGroupsOfFour =
      edition.competition.groups === 3 &&
      edition.competition.teamsPerGroup === 4 &&
      groupedParticipants.size === 3 &&
      [...groupedParticipants.values()].every((group) => group.length === 4);
    const thirdPlaceParticipants = participants.filter(
      ({ position }) => position === 3,
    );
    const fairPlayScore = (teamId: number) => {
      const stats = fairPlayStats.find((entry) => entry.teamId === teamId);
      return (stats?._sum.yellowCards ?? 0) + (stats?._sum.redCards ?? 0) * 3;
    };
    const bestThirdPlaceIds = isThreeGroupsOfFour
      ? [...thirdPlaceParticipants]
          .sort(
            (a, b) =>
              (b.points ?? 0) - (a.points ?? 0) ||
              b.gd - a.gd ||
              b.gf - a.gf ||
              fairPlayScore(a.teamId) - fairPlayScore(b.teamId),
          )
          .slice(0, 2)
          .map(({ teamId }) => teamId)
      : [];
    const europaLeagueThirdPlaceIds =
      edition.competition.name === 'UEFA Champions League'
        ? thirdPlaceParticipants.map(({ teamId }) => teamId)
        : [];

    if (europaLeagueThirdPlaceIds.length > 0) {
      const europaLeagueEdition = await tx.competitionEdition.findFirst({
        where: {
          seasonId: edition.seasonId,
          competition: {
            is: { name: 'UEFA Europa League' },
          },
        },
        select: { id: true },
      });

      if (!europaLeagueEdition) {
        throw new BadRequestException(
          `No UEFA Europa League edition exists for season ${edition.seasonId}.`,
        );
      }

      await tx.competitionParticipant.createMany({
        data: europaLeagueThirdPlaceIds.map((teamId) => ({
          competitionEditionId: europaLeagueEdition.id,
          teamId,
          points: 0,
        })),
        skipDuplicates: true,
      });
    }

    const qualifiedTeamIds = new Set([
      ...participants
        .filter(({ position }) => position === 1 || position === 2)
        .map(({ teamId }) => teamId),
      ...bestThirdPlaceIds,
      ...europaLeagueThirdPlaceIds,
    ]);
    const eliminatedTeamIds = participants
      .filter(({ teamId }) => !qualifiedTeamIds.has(teamId))
      .map(({ teamId }) => teamId);

    if (eliminatedTeamIds.length > 0) {
      await tx.competitionParticipant.deleteMany({
        where: {
          competitionEditionId,
          teamId: { in: eliminatedTeamIds },
        },
      });
    }
  }

  changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    return this.prisma.match.update({
      where: { id: matchId },
      data,
    });
  }

  // ! Match Player Stats Queries
  findMatchPlayerStats(matchId: number, playerId: number) {
    return this.prisma.matchPlayerStats.findUnique({
      where: {
        matchId_playerId: {
          matchId,
          playerId,
        },
      },
    });
  }

  // ! Match Team Stats Queries

  findMatchTeamStats(matchId: number, teamId: number) {
    return this.prisma.matchTeamStats.findUnique({
      where: {
        teamId_matchId: {
          teamId,
          matchId,
        },
      },
    });
  }
}
