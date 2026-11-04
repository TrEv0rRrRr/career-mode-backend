import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompetitionFormat,
  CompetitionParticipant,
  Match,
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
import { CreateMatchWithTieKeyDto } from './dto/create-match-with-tieKey.dto.ts';
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
    data: CreateMatchWithTieKeyDto[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const tieIds = new Map<string, number>();

      if (isKnockoutMatch(type)) {
        // matches.repository.ts
        const tieKeys = new Set(
          data.map((match) => {
            const key = match.tieKey?.trim();

            if (isKnockoutMatch(type) && !key) {
              throw new BadRequestException(
                'Every knockout match must have a tieKey.',
              );
            }

            return key;
          }),
        );

        for (const tieKey of tieKeys) {
          const tie = await tx.tie.create({ data: {} });
          if (tieKey !== undefined) {
            tieIds.set(tieKey, tie.id);
          }
        }
      }

      const matchData = data.map(({ tieKey, ...match }) => ({
        ...match,
        type,
        status: MatchStatus.SCHEDULED,
        homeGoals: 0,
        awayGoals: 0,
        homePenaltyGoals: null,
        awayPenaltyGoals: null,
        finishType: null,
        tieId: isKnockoutMatch(type) ? tieIds.get(tieKey!.trim())! : null,
        competitionEditionId,
      }));

      return tx.match.createMany({ data: matchData });
    });
  }

  async createKnockoutRoundMatches(
    knockoutRoundId: number,
    ties: {
      matches: CreateMatchDto[];
    }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      for (const tieData of ties) {
        const tie = await tx.tie.create({
          data: {
            knockoutRoundId,
          },
        });

        await tx.match.createMany({
          data: tieData.matches.map((match) => ({
            ...match,
            tieId: tie.id,
          })),
        });
      }
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
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          ...data.match,
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
        competitionFormat === CompetitionFormat.LEAGUE ||
        competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT;

      const homeParticipantUpdate = {
        played: { increment: 1 },
        wins: { increment: isHomeWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isAwayWinner ? 1 : 0 },
        gf: { increment: data.match.homeGoals },
        ga: { increment: data.match.awayGoals },
        gd: { increment: data.match.homeGoals - data.match.awayGoals },
        ...(usesStandings && {
          points: {
            increment: isHomeWinner ? 3 : isDraw ? 1 : 0,
          },
        }),
      };

      const awayParticipantUpdate = {
        played: { increment: 1 },
        wins: { increment: isAwayWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isHomeWinner ? 1 : 0 },
        gf: { increment: data.match.awayGoals },
        ga: { increment: data.match.homeGoals },
        gd: { increment: data.match.awayGoals - data.match.homeGoals },
        ...(usesStandings && {
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

      const matchIds = matches.map(({ id }) => id);

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

      if (competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT) {
        await this.recalculateGroupStandings(
          matches,
          groups,
          competitionParticipants,
          competitionEditionId,
          fairPlayStats,
          tx,
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

      if (roundFinished) {
        resolveKnockoutWinners(edition, matchesByRound);
      }

      return updatedMatch;
    });
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
