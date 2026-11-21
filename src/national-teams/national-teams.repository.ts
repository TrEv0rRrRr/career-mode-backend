import { Injectable } from '@nestjs/common';
import { Confederation, Prisma } from '@prisma/client';
import { matchInclude } from '../matches/matches.repository.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { FireManagerDto } from '../teams/dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from '../teams/dto/managers/hire-manager.dto.ts';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { CallUpPlayerDto } from './dto/players/callup-player.dto.ts';
import { DismissPlayerDto } from './dto/players/dismiss-player.dto.ts';
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

  // ! National Team Matches Queries

  findNationalTeamMatches(ntId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: ntId }, { awayTeamId: ntId }],
      },
      include: matchInclude,
    });
  }

  // ! Player National Team Queries

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

  callUpPlayer(
    playerId: number,
    nationalTeamId: number,
    data: CallUpPlayerDto,
  ) {
    return this.prisma.playerNationalTeam.create({
      data: {
        ...data,
        nationalTeamId,
        playerId,
      },
    });
  }

  dismissPlayer(playerNtId: number, data: DismissPlayerDto) {
    return this.prisma.playerNationalTeam.update({
      where: {
        id: playerNtId,
      },
      data,
    });
  }

  // ! Manager National Team Queries

  findCurrentManager(nationalTeamId: number) {
    return this.prisma.managerNationalTeam.findFirst({
      where: {
        nationalTeamId,
        endDate: null,
      },
      include: {
        manager: true,
      },
    });
  }

  findNationalTeamManagerHistory(nationalTeamId: number) {
    return this.prisma.managerNationalTeam.findMany({
      where: {
        nationalTeamId,
      },
      include: {
        manager: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  hireManager(nationalTeamId: number, managerId: number, data: HireManagerDto) {
    return this.prisma.managerNationalTeam.create({
      data: {
        ...data,
        nationalTeamId,
        managerId,
      },
    });
  }

  fireManager(managerTeamId: number, data: FireManagerDto) {
    return this.prisma.managerNationalTeam.update({
      where: {
        id: managerTeamId,
      },
      data,
    });
  }

  fireAndHireManager(
    managerTeamId: number,
    nationalTeamId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.managerNationalTeam.update({
        where: {
          id: managerTeamId,
        },
        data: {
          endDate: data.startDate,
        },
      });

      return tx.managerNationalTeam.create({
        data: {
          ...data,
          nationalTeamId,
          managerId,
        },
      });
    });
  }
}
