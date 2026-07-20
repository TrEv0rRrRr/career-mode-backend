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

  update(id: number, data: UpdateTeamDto) {
    return this.prisma.team.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }
}
