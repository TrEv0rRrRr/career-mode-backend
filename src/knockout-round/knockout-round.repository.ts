import { Injectable } from '@nestjs/common';
import { MatchType, Prisma } from '@prisma/client';
import { transformKnockoutRoundTypeToMatchType } from '../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { NextKnockoutRoundData } from '../common/types/NextKnockoutRoundData.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { KnockoutRoundType } from './enums/KnockoutRoundType.ts';

type CreatedRounds = {
  qualifiedClubs: {
    clubId: number;
    knockoutRoundId: number;
  }[];
} & {
  id: number;
  completed: boolean;
  type: MatchType;
  competitionEditionId: number;
};

export const knockoutRoundInclude = {
  qualifiedClubs: {
    include: {
      club: true,
    },
  },
  ties: {
    include: {
      matches: true,
    },
  },
} satisfies Prisma.KnockoutRoundInclude;

export type KnockoutRoundWithRelations = Prisma.KnockoutRoundGetPayload<{
  include: typeof knockoutRoundInclude;
}>;

@Injectable()
export class KnockoutRoundRepository {
  constructor(private prisma: PrismaService) {}

  findKnockoutRoundById(
    knockoutRoundId: number,
  ): Promise<KnockoutRoundWithRelations | null> {
    return this.prisma.knockoutRound.findUnique({
      where: {
        id: knockoutRoundId,
      },
      include: knockoutRoundInclude,
    });
  }

  findKnockoutRoundByTypeAndCompetitionEditionId(
    competitionEditionId: number,
    type: KnockoutRoundType,
  ) {
    return this.prisma.knockoutRound.findUnique({
      where: {
        competitionEditionId_type: {
          competitionEditionId,
          type: transformKnockoutRoundTypeToMatchType(type),
        },
      },
      include: knockoutRoundInclude,
    });
  }

  findNonCompletedKnockoutRoundByCompetitionEditionId(
    competitionEditionId: number,
  ) {
    return this.prisma.knockoutRound.findFirst({
      where: {
        competitionEditionId,
        completed: false,
      },
    });
  }

  countKnockoutRoundTies(knockoutRoundId: number) {
    return this.prisma.tie.count({
      where: { knockoutRoundId },
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

  createKnockoutRound(data: CreateKnockoutRoundDto, type: KnockoutRoundType) {
    return this.prisma.knockoutRound.create({
      data: {
        ...data,
        type: transformKnockoutRoundTypeToMatchType(type),
        qualifiedClubs: {
          create: data.qualifiedClubs.map((clubId) => ({
            clubId,
          })),
        },
        completed: false,
      },
      include: {
        qualifiedClubs: true,
      },
    });
  }

  async resolveRoundAndCreateNextRounds(
    knockoutRoundId: number,
    nextRounds: NextKnockoutRoundData[],
    eliminatedClubIds: number[] = [],
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
            qualifiedClubs: {
              create: round.qualifiedClubIds.map((clubId) => ({
                clubId,
              })),
            },
          },
          include: {
            qualifiedClubs: true,
          },
        });

        createdRounds.push(createdRound);
      }

      if (eliminatedClubIds.length > 0) {
        await tx.competitionParticipant.deleteMany({
          where: {
            competitionEditionId,
            clubId: { in: eliminatedClubIds },
          },
        });
      }

      return createdRounds;
    });
  }
}
