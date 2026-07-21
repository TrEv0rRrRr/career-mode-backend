import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { AssignPositionsDto } from './dto/assign-positions.dto.ts';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto.ts';
import { UpdatePlayerDto } from './dto/update-player.dto.ts';

const playerInclude = {
  playerPositions: true,
} as const;

@Injectable()
export class PlayersRepository {
  constructor(private prisma: PrismaService) {}

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
}
