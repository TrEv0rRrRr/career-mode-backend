import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
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
}
