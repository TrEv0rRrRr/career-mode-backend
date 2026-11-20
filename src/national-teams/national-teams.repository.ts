import { Injectable } from '@nestjs/common';
import { Confederation, Prisma } from '@prisma/client';
import { matchInclude } from '../matches/matches.repository.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';

const nationalTeamInclude = {
  managerNationalTeams: {
    where: { endDate: null },
    include: { manager: true },
  },
  stadium: true,
} as const;

export type NationalTeamWithRelations = Prisma.NationalTeamGetPayload<{
  include: typeof nationalTeamInclude;
}>;

@Injectable()
export class NationalTeamsRepository {
  constructor(private prisma: PrismaService) {}

  // ! NT Queries
  findById(id: number) {
    return this.prisma.nationalTeam.findUnique({
      where: { id },
      include: nationalTeamInclude,
    });
  }

  findByConfederation(confederation: Confederation) {
    return this.prisma.nationalTeam.findMany({
      where: { confederation },
      include: nationalTeamInclude,
    });
  }

  findByName(name: string) {
    return this.prisma.nationalTeam.findUnique({
      where: { name },
      include: nationalTeamInclude,
    });
  }

  findAll() {
    return this.prisma.nationalTeam.findMany({
      include: nationalTeamInclude,
    });
  }

  create(data: CreateNationalTeamDto) {
    return this.prisma.nationalTeam.create({ data });
  }

  createMany(data: CreateNationalTeamDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.nationalTeam.createMany({ data });
    });
  }

  update(id: number, data: UpdateNationalTeamDto) {
    return this.prisma.nationalTeam.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.nationalTeam.delete({ where: { id } });
  }

  // ! Player NT Queries

  findCalledUpPlayers(ntId: number) {
    return this.prisma.playerNationalTeam.findMany({
      where: {
        nationalTeamId: ntId,
        endDate: null,
      },
      include: {
        player: true,
      },
    });
  }

  // ! National Team Matches Queries

  findNationalTeamMatches(ntId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: ntId }, { awayTeamId: ntId }],
      },
      include: matchInclude,
    });
  }
}
