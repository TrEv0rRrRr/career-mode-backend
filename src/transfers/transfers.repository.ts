import { Injectable } from '@nestjs/common';
import { PlayerTeam, TransferType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateTransferDto } from './dto/create-transfer.dto.ts';

@Injectable()
export class TransfersRepository {
  constructor(private prisma: PrismaService) {}

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

  completeTransfer(currentTeam: PlayerTeam | null, data: CreateTransferDto) {
    return this.prisma.$transaction(async (tx) => {
      if (currentTeam)
        await tx.playerTeam.update({
          where: {
            id: currentTeam.id,
          },
          data: {
            endDate: data.date,
          },
        });

      await tx.playerTeam.create({
        data: {
          playerId: data.playerId,
          teamId: data.toTeamId,
          jerseyNumber: data.jerseyNumber,
          startDate: data.date,
        },
      });

      return tx.transfer.create({
        data: {
          date: data.date,
          fee: data.fee,
          type: data.type,
          fromTeamId: data.fromTeamId,
          toTeamId: data.toTeamId,
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
