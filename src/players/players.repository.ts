import { Injectable } from '@nestjs/common';
import { SignPlayerDto } from '../clubs/dto/players/sign-player.dto.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreatePlayerDto } from './dto/player/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/player/update-player.dto.ts';
import { AssignPositionsDto } from './dto/positions/assign-positions.dto.ts';
import { UpdatePlayerPositionDto } from './dto/positions/update-player-position.dto.ts';

const playerInclude = {
  playerPositions: true,
  playerClubs: true,
} as const;

@Injectable()
export class PlayersRepository {
  constructor(private prisma: PrismaService) {}

  async clubExists(clubId: number) {
    return (
      (await this.prisma.club.findUnique({
        where: { id: clubId },
        select: { id: true },
      })) !== null
    );
  }

  // ! Player Queries

  findById(id: number) {
    return this.prisma.player.findUnique({
      where: { id },
      include: playerInclude,
    });
  }

  findAll() {
    return this.prisma.player.findMany({
      include: playerInclude,
    });
  }

  findByName(name: string) {
    return this.prisma.player.findFirst({
      where: { name },
      include: playerInclude,
    });
  }

  create(data: CreatePlayerDto) {
    return this.prisma.player.create({
      data,
    });
  }

  createMany(data: CreatePlayerDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.player.createMany({ data });
    });
  }

  update(id: number, data: UpdatePlayerDto) {
    return this.prisma.player.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.player.delete({
      where: { id },
    });
  }

  // ! Player position Queries

  findPlayerPositions(playerId: number) {
    return this.prisma.playerPosition.findMany({
      where: { playerId },
      include: {
        position: true,
      },
    });
  }

  findPlayerPosition(playerId: number, positionId: number) {
    return this.prisma.playerPosition.findUnique({
      where: {
        playerId_positionId: {
          playerId,
          positionId,
        },
      },
    });
  }

  findAnotherMainPosition(playerId: number, positionId: number) {
    return this.prisma.playerPosition.findFirst({
      where: {
        playerId,
        isPrimary: true,
        NOT: {
          positionId,
        },
      },
    });
  }

  assignPositions(playerId: number, data: AssignPositionsDto) {
    return this.prisma.playerPosition.create({
      data: {
        playerId,
        positionId: data.positionId,
        isPrimary: data.isPrimary,
      },
    });
  }

  replacePlayerPositions(playerId: number, data: AssignPositionsDto[]) {
    const playerPositions = data.map((position) => ({
      playerId,
      positionId: position.positionId,
      isPrimary: position.isPrimary,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.playerPosition.deleteMany({
        where: { playerId },
      });

      return tx.playerPosition.createMany({
        data: playerPositions,
      });
    });
  }

  makePositionsNotPrimary(playerId: number) {
    return this.prisma.playerPosition.updateMany({
      where: {
        playerId,
      },
      data: {
        isPrimary: false,
      },
    });
  }

  updatePlayerPosition(
    playerId: number,
    positionId: number,
    data: UpdatePlayerPositionDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (data.isPrimary) {
        await tx.playerPosition.updateMany({
          where: { playerId },
          data: { isPrimary: false },
        });
      }

      return tx.playerPosition.update({
        where: {
          playerId_positionId: {
            playerId,
            positionId,
          },
        },
        data,
      });
    });
  }

  deletePlayerPosition(playerId: number, positionId: number) {
    return this.prisma.playerPosition.delete({
      where: {
        playerId_positionId: {
          playerId,
          positionId,
        },
      },
    });
  }

  // ! Player club Queries

  findPlayerClubHistory(playerId: number) {
    return this.prisma.playerClub.findMany({
      where: { playerId },
      include: {
        club: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findCurrentClub(playerId: number) {
    return this.prisma.playerClub.findFirst({
      where: {
        playerId,
        endDate: null,
      },
      include: {
        club: true,
      },
    });
  }

  // ! Dev only!

  findCurrentClubs(playerIds: number[]): Promise<Map<number, number>> {
    return this.prisma.playerClub
      .findMany({
        where: {
          playerId: {
            in: playerIds,
          },
        },
      })
      .then(
        (playerClub) =>
          new Map(playerClub.map((pt) => [pt.playerId, pt.clubId])),
      );
  }

  // ! Dev only!

  replacePlayerClubs(clubId: number, playerId: number, data: SignPlayerDto[]) {
    const playerClubs = data.map((club) => ({
      ...club,
      clubId,
      playerId,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.playerClub.deleteMany({
        where: { playerId },
      });

      return tx.playerClub.createMany({
        data: playerClubs,
      });
    });
  }

  // ! Dev only!

  deletePlayerClub(playerClubId: number) {
    return this.prisma.playerClub.delete({
      where: {
        id: playerClubId,
      },
    });
  }

  // ! Player season stats Queries

  findPlayerSeasonStats(playerId: number) {
    return this.prisma.playerSeasonStats.findMany({
      where: { playerId },
      include: { season: true },
    });
  }

  findPlayerStatsBySeasonAndClub(
    playerId: number,
    clubId: number,
    seasonId: number,
  ) {
    return this.prisma.playerSeasonStats.findUnique({
      where: {
        playerId_clubId_seasonId: { playerId, clubId, seasonId },
      },
      include: {
        club: true,
        season: true,
      },
    });
  }

  // ! Player National Club Queries

  findPlayerCurrentCallUp(playerId: number) {
    return this.prisma.playerNationalTeam.findFirst({
      where: {
        playerId,
        endDate: null,
      },
      include: {
        nationalTeam: true,
      },
    });
  }

  findPlayerCallUpHistory(playerId: number) {
    return this.prisma.playerNationalTeam.findMany({
      where: {
        playerId,
      },
      include: {
        nationalTeam: true,
      },
    });
  }
}
