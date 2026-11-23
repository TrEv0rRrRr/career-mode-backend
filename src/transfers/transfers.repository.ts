import { Injectable } from '@nestjs/common';
import { PlayerClub, TransferType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateTransferDto } from './dto/create-transfer.dto.ts';

@Injectable()
export class TransfersRepository {
  constructor(private prisma: PrismaService) {}

  async playerExists(playerId: number) {
    return (
      (await this.prisma.player.findUnique({
        where: { id: playerId },
        select: { id: true },
      })) !== null
    );
  }

  findCurrentClub(playerId: number) {
    return this.prisma.playerClub.findFirst({
      where: {
        playerId,
        endDate: null,
      },
    });
  }

  findById(id: number) {
    return this.prisma.transfer.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.transfer.findMany({ orderBy: { fee: 'desc' } });
  }

  findByType(type: TransferType) {
    return this.prisma.transfer.findMany({
      where: { type },
      orderBy: { fee: 'desc' },
    });
  }

  async clubExists(clubId: number) {
    return (
      (await this.prisma.club.findUnique({
        where: { id: clubId },
        select: { id: true },
      })) !== null
    );
  }

  completeTransfer(
    currentClub: PlayerClub | null,
    data: CreateTransferDto,
    type: TransferType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (currentClub)
        await tx.playerClub.update({
          where: {
            id: currentClub.id,
          },
          data: {
            endDate: data.date,
          },
        });

      await tx.playerClub.create({
        data: {
          playerId: data.playerId,
          clubId: data.toClubId,
          jerseyNumber: data.jerseyNumber,
          startDate: data.date,
        },
      });

      return tx.transfer.create({
        data: {
          date: data.date,
          fee: data.fee,
          type,
          fromClubId: data.fromClubId,
          toClubId: data.toClubId,
          playerId: data.playerId,
          seasonId: data.seasonId,
        },
      });
    });
  }

  deleteTransfer(id: number) {
    return this.prisma.transfer.delete({ where: { id } });
  }
}
