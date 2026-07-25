import { MatchStatus, MatchType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';

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

  create(type: MatchType, data: CreateMatchDto) {
    const matchData = {
      ...data,
      status: MatchStatus.SCHEDULED,
      type,
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

  update(matchId: number, data: UpdateMatchDto) {
    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        ...data,
        status: MatchStatus.PLAYED,
      },
    });
  }
}
