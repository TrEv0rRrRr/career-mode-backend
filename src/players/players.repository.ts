import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreatePlayerDto } from './dto/player/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/player/update-player.dto.ts';
import { AssignPositionsDto } from './dto/positions/assign-positions.dto.ts';
import { UpdatePlayerPositionDto } from './dto/positions/update-player-position.dto.ts';
import { AssignTeamDto } from './dto/teams/assign-team.dto.ts';
import { UpdatePlayerTeamDto } from './dto/teams/update-player-team.dto.ts';

const playerInclude = {
  playerPositions: true,
  playerTeams: true,
} as const;

@Injectable()
export class PlayersRepository {
  constructor(private prisma: PrismaService) {}

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

  // ! Player team Queries

  findPlayerTeams(playerId: number) {
    return this.prisma.playerTeam.findMany({
      where: { playerId },
      include: {
        team: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findPlayerTeam(playerTeamId: number) {
    return this.prisma.playerTeam.findUnique({
      where: {
        id: playerTeamId,
      },
    });
  }

  findCurrentTeam(playerId: number) {
    return this.prisma.playerTeam.findFirst({
      where: {
        playerId,
        endDate: null,
      },
      select: {
        team: true,
        startDate: true,
        endDate: true,
      },
    });
  }

  assignTeam(playerId: number, data: AssignTeamDto) {
    return this.prisma.playerTeam.create({
      data: {
        ...data,
        playerId,
      },
    });
  }

  replacePlayerTeams(playerId: number, data: AssignTeamDto[]) {
    const playerTeams = data.map((team) => ({
      ...team,
      playerId,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.playerTeam.deleteMany({
        where: { playerId },
      });

      return tx.playerTeam.createMany({
        data: playerTeams,
      });
    });
  }

  updatePlayerTeam(playerTeamId: number, data: UpdatePlayerTeamDto) {
    return this.prisma.playerTeam.update({
      where: {
        id: playerTeamId,
      },
      data,
    });
  }

  deletePlayerTeam(playerTeamId: number) {
    return this.prisma.playerTeam.delete({
      where: {
        id: playerTeamId,
      },
    });
  }

  // ! Player season stats Queries

  findPlayerSeasonStats(playerId: number) {
    return this.prisma.playerSeasonStats.findMany({ where: { playerId } });
  }

  findPlayerStatsBySeasonAndTeam(
    playerId: number,
    teamId: number,
    seasonId: number,
  ) {
    return this.prisma.playerSeasonStats.findUnique({
      where: {
        playerId_teamId_seasonId: { playerId, teamId, seasonId },
      },
    });
  }
}
