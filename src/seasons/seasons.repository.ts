import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateSeasonDto } from './dto/create-season.dto.ts';

const seasonInclude = {
  transfers: {
    include: {
      player: true,
      fromTeam: true,
      toTeam: true,
    },
  },
  teamSeasonStats: {
    include: {
      team: true,
    },
  },
  competitionEditions: {
    include: {
      competition: true,
      winnerTeam: true,
    },
  },
} as const;

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
      },
    });
  }

  delete(id: number) {
    return this.prisma.season.delete({ where: { id } });
  }

  findAllTeamStats(seasonId: number) {
    return this.prisma.teamSeasonStats.findMany({ where: { seasonId } });
  }
}
