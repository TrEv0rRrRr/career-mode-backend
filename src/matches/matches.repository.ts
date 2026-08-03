import { MatchStatus, MatchType } from '@prisma/client';
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

  playMatch(matchId: number, data: PlayMatchDto) {
    return this.prisma.$transaction(async (tx) => {
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          ...data.match,
          status: MatchStatus.PLAYED,
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
