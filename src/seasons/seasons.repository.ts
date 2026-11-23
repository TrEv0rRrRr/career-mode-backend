import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateSeasonDto } from './dto/create-season.dto.ts';

const seasonInclude = {
  transfers: {
    include: {
      player: true,
      fromClub: true,
      toClub: true,
    },
  },
  clubSeasonStats: {
    include: {
      club: true,
    },
  },
  competitionEditions: {
    include: {
      competition: true,
      winnerClub: true,
    },
  },
} as const;

export type SeasonWithRelations = Prisma.SeasonGetPayload<{
  include: typeof seasonInclude;
}>;
@Injectable()
export class SeasonsRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.season.findMany({ include: seasonInclude });
  }

  findById(id: number) {
    return this.prisma.season.findUnique({
      where: { id },
      include: seasonInclude,
    });
  }

  findCurrentSeason() {
    return this.prisma.season.findFirst({
      where: {
        completed: false,
      },
      include: seasonInclude,
    });
  }

  findByCode(code: string) {
    return this.prisma.season.findUnique({
      where: { code },
      include: seasonInclude,
    });
  }

  create(data: CreateSeasonDto) {
    const [firstYear, secondYear] = data.code.split('/');

    return this.prisma.season.create({
      data: {
        ...data,
        startDate: new Date(`${firstYear}-07-01`),
        endDate: new Date(`${secondYear}-06-30`),
        completed: false,
      },
    });
  }

  completeCurrentSeason(seasonId: number) {
    return this.prisma.season.update({
      where: {
        id: seasonId,
      },
      data: {
        completed: true,
      },
    });
  }

  delete(id: number) {
    return this.prisma.season.delete({ where: { id } });
  }

  findAllClubStats(seasonId: number) {
    return this.prisma.clubSeasonStats.findMany({
      where: { seasonId },
      include: { club: true },
    });
  }
}
