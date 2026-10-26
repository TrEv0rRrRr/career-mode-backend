import { Injectable } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { NextKnockoutRoundData } from '../common/types/NextKnockoutRoundData.ts';

type CreatedRounds = {
  qualifiedTeams: {
    teamId: number;
    knockoutRoundId: number;
  }[];
} & {
  id: number;
  completed: boolean;
  type: MatchType;
  competitionEditionId: number;
};

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

  findKnockoutRoundByTypeAndCompetitionId(
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

  completeKnockoutRound(knockoutRoundId: number) {
    return this.prisma.knockoutRound.update({
      where: {
        id: knockoutRoundId,
      },
      data: {
        completed: true,
      },
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

  async resolveRoundAndCreateNextRounds(
    knockoutRoundId: number,
    nextRounds: NextKnockoutRoundData[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Solo una ejecución puede completar esta ronda.
      const result = await tx.knockoutRound.updateMany({
        where: {
          id: knockoutRoundId,
          completed: false,
        },
        data: {
          completed: true,
        },
      });

      if (result.count !== 1) {
        throw new Error(
          'Knockout round is already completed or does not exist.',
        );
      }

      const competitionEditionId = (
        await tx.knockoutRound.findUniqueOrThrow({
          where: { id: knockoutRoundId },
          select: { competitionEditionId: true },
        })
      ).competitionEditionId;

      const createdRounds: CreatedRounds[] = [];

      for (const round of nextRounds) {
        const createdRound = await tx.knockoutRound.create({
          data: {
            competitionEditionId,
            type: round.type,
            qualifiedTeams: {
              create: round.qualifiedTeamIds.map((teamId) => ({
                teamId,
              })),
            },
          },
          include: {
            qualifiedTeams: true,
          },
        });

        createdRounds.push(createdRound);
      }

      return createdRounds;
    });
  }
}
