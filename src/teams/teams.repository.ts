import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';

const teamInclude = {
  manager: true,
  stadium: true,
  competition: true,
} as const;

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
    return this.prisma.teamSeasonStats.findMany({ where: { teamId } });
  }

  findTeamStatsBySeason(teamId: number, seasonId: number) {
    return this.prisma.teamSeasonStats.findUnique({
      where: { teamId_seasonId: { teamId, seasonId } },
    });
  }

  // ! Team Matches Queries

  findTeamMatches(teamId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
    });
  }
}
