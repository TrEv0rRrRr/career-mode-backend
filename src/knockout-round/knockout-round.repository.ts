import { Injectable } from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';
import { transformKnockoutRoundTypeToMatchType } from '../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { NextKnockoutRoundData } from '../common/types/NextKnockoutRoundData.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { KnockoutRoundType } from './enums/KnockoutRoundType.ts';

export const knockoutRoundInclude = {
  qualifiedClubs: {
    include: {
      club: true,
    },
  },
  qualifiedNationalTeams: {
    include: {
      nationalTeam: true,
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

type CreatedKnockoutRound = Prisma.KnockoutRoundGetPayload<{
  include: {
    qualifiedClubs: true;
    qualifiedNationalTeams: true;
  };
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
        competitionEditionId: data.competitionEditionId,
        type: transformKnockoutRoundTypeToMatchType(type),
        qualifiedClubs: data.qualifiedClubs
          ? {
              create: data.qualifiedClubs.map((clubId) => ({
                clubId,
              })),
            }
          : undefined,
        qualifiedNationalTeams: data.qualifiedNationalTeams
          ? {
              create: data.qualifiedNationalTeams.map((nationalTeamId) => ({
                nationalTeamId,
              })),
            }
          : undefined,
        completed: false,
      },
      include: {
        qualifiedClubs: true,
        qualifiedNationalTeams: true,
      },
    });
  }

  async resolveRoundAndCreateNextRounds(
    knockoutRoundId: number,
    nextRounds: NextKnockoutRoundData[],
    eliminatedParticipantIds: number[] = [],
  ) {
    return this.prisma.$transaction(async (tx) => {
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

      const competitionEdition = await tx.knockoutRound.findUniqueOrThrow({
        where: { id: knockoutRoundId },
        select: {
          competitionEditionId: true,
          competitionEdition: {
            select: { competition: { select: { type: true } } },
          },
        },
      });
      const competitionEditionId = competitionEdition.competitionEditionId;
      const isNationalTeamsCompetition =
        competitionEdition.competitionEdition.competition.type ===
        CompetitionType.NATIONAL_TEAMS;

      const createdRounds: CreatedKnockoutRound[] = [];

      for (const round of nextRounds) {
        const createdRound = await tx.knockoutRound.create({
          data: {
            competitionEditionId,
            type: round.type,
            qualifiedClubs:
              'qualifiedClubIds' in round
                ? {
                    create: round.qualifiedClubIds.map((clubId) => ({
                      clubId,
                    })),
                  }
                : undefined,
            qualifiedNationalTeams:
              'qualifiedNationalTeamIds' in round
                ? {
                    create: round.qualifiedNationalTeamIds.map(
                      (nationalTeamId) => ({ nationalTeamId }),
                    ),
                  }
                : undefined,
          },
          include: {
            qualifiedClubs: true,
            qualifiedNationalTeams: true,
          },
        });

        createdRounds.push(createdRound);
      }

      if (eliminatedParticipantIds.length > 0) {
        if (isNationalTeamsCompetition) {
          await tx.nationalTeamCompetitionParticipant.deleteMany({
            where: {
              competitionEditionId,
              nationalTeamId: { in: eliminatedParticipantIds },
            },
          });
        } else {
          await tx.competitionParticipant.deleteMany({
            where: {
              competitionEditionId,
              clubId: { in: eliminatedParticipantIds },
            },
          });
        }
      }

      return createdRounds;
    });
  }
}
