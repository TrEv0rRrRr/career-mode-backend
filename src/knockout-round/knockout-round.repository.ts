import { Injectable } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { UpdateKnockoutRoundDto } from './dto/update-knockout-round.dto.ts';

@Injectable()
export class KnockoutRoundRepository {
  constructor(private prisma: PrismaService) {}

  findKnockoutRoundById(knockoutRoundId: number) {
    return this.prisma.knockoutRound.findUnique({
      where: {
        id: knockoutRoundId,
      },
    });
  }

  findKnockoutRoundByCompetitionEditionId(
    competitionEditionId: number,
    type: MatchType,
  ) {
    return this.prisma.knockoutRound.findUnique({
      where: {
        competitionEditionId_type: {
          competitionEditionId,
          type,
        },
      },
      include: {
        qualifiedTeams: true,
      },
    });
  }

  completeKnockoutRound(knockoutRoundId: number, data: UpdateKnockoutRoundDto) {
    return this.prisma.knockoutRound.update({
      where: {
        id: knockoutRoundId,
      },
      data,
    });
  }

  createKnockoutRound(
    data: CreateKnockoutRoundDto,
    qualifiedTeamIds: number[],
  ) {
    return this.prisma.knockoutRound.create({
      data: {
        ...data,
        qualifiedTeams: {
          create: qualifiedTeamIds.map((teamId) => ({
            teamId,
          })),
        },
        completed: false,
      },
      include: {
        qualifiedTeams: true,
      },
    });
  }
}
