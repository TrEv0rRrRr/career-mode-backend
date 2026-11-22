import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { matchInclude } from '../matches/matches.repository.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { FireManagerDto } from './dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from './dto/managers/hire-manager.dto.ts';
import { ChangePlayerJerseyNumberDto } from './dto/players/change-player-jersey-number.dto.ts';
import { ReleasePlayerDto } from './dto/players/release-player.dto.ts';
import { SignPlayerDto } from './dto/players/sign-player.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';

const teamInclude = {
  managerTeams: {
    where: { endDate: null },
    include: { manager: true },
  },
  stadium: true,
  competition: true,
} as const;

export type TeamWithRelations = Prisma.TeamGetPayload<{
  include: typeof teamInclude;
}>;

@Injectable()
export class TeamsRepository {
  constructor(private prisma: PrismaService) {}

  // ! Team Queries

  findById(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
      include: teamInclude,
    });
  }

  findByLeague(leagueId: number) {
    return this.prisma.team.findMany({
      where: { leagueId },
      include: teamInclude,
    });
  }

  findByCountry(country: string) {
    return this.prisma.team.findMany({
      where: { country },
      include: teamInclude,
    });
  }

  findByName(name: string) {
    return this.prisma.team.findUnique({
      where: { name },
      include: teamInclude,
    });
  }

  findAll() {
    return this.prisma.team.findMany({
      include: teamInclude,
    });
  }

  create(data: CreateTeamDto) {
    return this.prisma.team.create({ data });
  }

  createMany(data: CreateTeamDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.team.createMany({ data });
    });
  }

  update(id: number, data: UpdateTeamDto) {
    return this.prisma.team.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }

  // ! Player Team Queries

  findPlayers(teamId: number) {
    return this.prisma.playerTeam.findMany({
      where: {
        teamId,
      },
      include: {
        player: true,
      },
    });
  }

  findPlayer(teamId: number, playerId: number) {
    return this.prisma.playerTeam.findFirst({
      where: {
        teamId,
        playerId,
      },
      include: {
        player: true,
      },
    });
  }

  signPlayer(teamId: number, playerId: number, data: SignPlayerDto) {
    return this.prisma.playerTeam.create({
      data: {
        ...data,
        teamId,
        playerId,
      },
    });
  }

  changePlayerJerseyNumber(
    playerTeamId: number,
    data: ChangePlayerJerseyNumberDto,
  ) {
    return this.prisma.playerTeam.update({
      where: {
        id: playerTeamId,
      },
      data,
    });
  }

  releasePlayer(playerTeamId: number, data: ReleasePlayerDto) {
    return this.prisma.playerTeam.update({
      where: {
        id: playerTeamId,
      },
      data,
    });
  }

  // ! Player Season Stats Queries

  findTeamPlayerStats(teamId: number) {
    return this.prisma.playerSeasonStats.findMany({
      where: { teamId },
      include: {
        player: true,
      },
    });
  }

  findTeamPlayerStatsBySeason(teamId: number, seasonId: number) {
    return this.prisma.playerSeasonStats.findMany({
      where: { teamId, seasonId },
      include: {
        player: true,
      },
    });
  }

  // ! Team Season Queries

  findTeamStats(teamId: number) {
    return this.prisma.teamSeasonStats.findMany({
      where: { teamId },
      include: {
        season: true,
      },
    });
  }

  findTeamStatsBySeason(teamId: number, seasonId: number) {
    return this.prisma.teamSeasonStats.findUnique({
      where: { teamId_seasonId: { teamId, seasonId } },
      include: {
        season: true,
      },
    });
  }

  // ! Team Matches Queries

  findTeamMatches(teamId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: matchInclude,
    });
  }

  // ! Manager Team Queries
  findCurrentManager(teamId: number) {
    return this.prisma.managerTeam.findFirst({
      where: {
        teamId,
        endDate: null,
      },
      include: {
        manager: true,
      },
    });
  }

  findTeamManagerHistory(teamId: number) {
    return this.prisma.managerTeam.findMany({
      where: {
        teamId,
      },
      include: {
        manager: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  hireManager(teamId: number, managerId: number, data: HireManagerDto) {
    return this.prisma.managerTeam.create({
      data: {
        ...data,
        teamId,
        managerId,
      },
    });
  }

  fireManager(managerTeamId: number, data: FireManagerDto) {
    return this.prisma.managerTeam.update({
      where: {
        id: managerTeamId,
      },
      data,
    });
  }

  fireAndHireManager(
    managerTeamId: number,
    teamId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.managerTeam.update({
        where: {
          id: managerTeamId,
        },
        data: {
          endDate: data.startDate,
        },
      });

      return tx.managerTeam.create({
        data: {
          ...data,
          teamId,
          managerId,
        },
      });
    });
  }
}
