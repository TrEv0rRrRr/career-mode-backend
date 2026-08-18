import { CompetitionFormat, MatchStatus, MatchType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';

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

  countByCompetitionEdition(competitionEditionId: number) {
    return this.prisma.match.count({ where: { competitionEditionId } });
  }

  create(type: MatchType, data: CreateMatchDto) {
    const matchData = {
      ...data,
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

  createMany(type: MatchType, data: CreateMatchDto[]) {
    const matchData = data.map((data) => {
      return {
        ...data,
        type,
        status: MatchStatus.SCHEDULED,
        homeGoals: 0,
        awayGoals: 0,
        homePenaltyGoals: null,
        awayPenaltyGoals: null,
        finishType: null,
      };
    });

    return this.prisma.$transaction(async (tx) => {
      return tx.match.createMany({ data: matchData });
    });
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
