import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { matchInclude } from '../matches/matches.repository.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateClubDto } from './dto/create-club.dto.ts';
import { FireManagerDto } from './dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from './dto/managers/hire-manager.dto.ts';
import { ChangePlayerJerseyNumberDto } from './dto/players/change-player-jersey-number.dto.ts';
import { ReleasePlayerDto } from './dto/players/release-player.dto.ts';
import { SignPlayerDto } from './dto/players/sign-player.dto.ts';
import { UpdateClubDto } from './dto/update-club.dto.ts';

const clubInclude = {
  managerClubs: {
    where: { endDate: null },
    include: { manager: true },
  },
  stadium: true,
  competition: true,
} as const;

export type ClubWithRelations = Prisma.ClubGetPayload<{
  include: typeof clubInclude;
}>;

@Injectable()
export class ClubsRepository {
  constructor(private prisma: PrismaService) {}

  // ! Club Queries

  findById(id: number) {
    return this.prisma.club.findUnique({
      where: { id },
      include: clubInclude,
    });
  }

  findByLeague(leagueId: number) {
    return this.prisma.club.findMany({
      where: { leagueId },
      include: clubInclude,
    });
  }

  findByCountry(country: string) {
    return this.prisma.club.findMany({
      where: { country },
      include: clubInclude,
    });
  }

  findByName(name: string) {
    return this.prisma.club.findUnique({
      where: { name },
      include: clubInclude,
    });
  }

  findAll() {
    return this.prisma.club.findMany({
      include: clubInclude,
    });
  }

  create(data: CreateClubDto) {
    return this.prisma.club.create({ data });
  }

  createMany(data: CreateClubDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.club.createMany({ data });
    });
  }

  update(id: number, data: UpdateClubDto) {
    return this.prisma.club.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.club.delete({ where: { id } });
  }

  // ! Player Club Queries

  findPlayers(clubId: number) {
    return this.prisma.playerClub.findMany({
      where: {
        clubId,
      },
      include: {
        player: true,
      },
    });
  }

  findPlayer(clubId: number, playerId: number) {
    return this.prisma.playerClub.findFirst({
      where: {
        clubId,
        playerId,
      },
      include: {
        player: true,
      },
    });
  }

  signPlayer(clubId: number, playerId: number, data: SignPlayerDto) {
    return this.prisma.playerClub.create({
      data: {
        ...data,
        clubId,
        playerId,
      },
    });
  }

  changePlayerJerseyNumber(
    playerClubId: number,
    data: ChangePlayerJerseyNumberDto,
  ) {
    return this.prisma.playerClub.update({
      where: {
        id: playerClubId,
      },
      data,
    });
  }

  releasePlayer(playerClubId: number, data: ReleasePlayerDto) {
    return this.prisma.playerClub.update({
      where: {
        id: playerClubId,
      },
      data,
    });
  }

  // ! Player Season Stats Queries

  findClubPlayerStats(clubId: number) {
    return this.prisma.playerSeasonStats.findMany({
      where: { clubId },
      include: {
        player: true,
      },
    });
  }

  findClubPlayerStatsBySeason(clubId: number, seasonId: number) {
    return this.prisma.playerSeasonStats.findMany({
      where: { clubId, seasonId },
      include: {
        player: true,
      },
    });
  }

  // ! Club Season Queries

  findClubStats(clubId: number) {
    return this.prisma.clubSeasonStats.findMany({
      where: { clubId },
      include: {
        season: true,
      },
    });
  }

  findClubStatsBySeason(clubId: number, seasonId: number) {
    return this.prisma.clubSeasonStats.findUnique({
      where: { clubId_seasonId: { clubId, seasonId } },
      include: {
        season: true,
      },
    });
  }

  // ! Club Matches Queries

  findClubMatches(clubId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ homeClubId: clubId }, { awayClubId: clubId }],
      },
      include: matchInclude,
    });
  }

  // ! Manager Club Queries
  findCurrentManager(clubId: number) {
    return this.prisma.managerClub.findFirst({
      where: {
        clubId,
        endDate: null,
      },
      include: {
        manager: true,
      },
    });
  }

  findClubManagerHistory(clubId: number) {
    return this.prisma.managerClub.findMany({
      where: {
        clubId,
      },
      include: {
        manager: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  hireManager(clubId: number, managerId: number, data: HireManagerDto) {
    return this.prisma.managerClub.create({
      data: {
        ...data,
        clubId,
        managerId,
      },
    });
  }

  fireManager(managerClubId: number, data: FireManagerDto) {
    return this.prisma.managerClub.update({
      where: {
        id: managerClubId,
      },
      data,
    });
  }

  fireAndHireManager(
    managerClubId: number,
    clubId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.managerClub.update({
        where: {
          id: managerClubId,
        },
        data: {
          endDate: data.startDate,
        },
      });

      return tx.managerClub.create({
        data: {
          ...data,
          clubId,
          managerId,
        },
      });
    });
  }
}
