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

  findByYear(year: string) {
    return this.prisma.season.findUnique({
      where: { year },
      include: seasonInclude,
    });
  }

  create(data: CreateSeasonDto) {
    return this.prisma.season.create({ data });
  }

  delete(id: number) {
    return this.prisma.season.delete({ where: { id } });
  }
}
