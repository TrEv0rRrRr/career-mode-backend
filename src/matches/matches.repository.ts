import { MatchStatus, MatchType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { UpdateMatchDto } from './dto/play-match.dto.ts';

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

  update(matchId: number, data: UpdateMatchDto) {
    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        ...data,
        status: MatchStatus.PLAYED,
      },
    });
  }

  changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    return this.prisma.match.update({
      where: { id: matchId },
      data,
    });
  }
}
