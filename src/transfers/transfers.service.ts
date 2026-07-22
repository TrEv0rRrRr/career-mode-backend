import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferType } from '@prisma/client';
import { PlayersService } from '../players/players.service.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CreateTransferDto } from './dto/create-transfer.dto.ts';

import { TransferNotFoundException } from './exceptions/transfer-not-found.exception.ts';
import { TransfersRepository } from './transfers.repository.ts';

@Injectable()
export class TransfersService {
  constructor(
    private repo: TransfersRepository,
    private teamsService: TeamsService,
    private playerService: PlayersService,
    private seasonService: SeasonsService,
  ) {}

  findTransfers() {
    return this.repo.findAll();
  }

  async findTransferById(transferId: number) {
    const transfer = await this.repo.findById(transferId);

    if (!transfer) throw new TransferNotFoundException();

    return transfer;
  }

  findTransfersByType(type: TransferType) {
    return this.repo.findByType(type);
  }

  async completeTransfer(data: CreateTransferDto) {
    await this.playerService.findPlayerById(data.playerId);

    if (data.fromTeamId) await this.teamsService.findTeamById(data.fromTeamId);

    await this.teamsService.findTeamById(data.toTeamId);

    await this.seasonService.findSeasonById(data.seasonId);

    if (0 > data.fee)
      throw new BadRequestException('The transfer fee cannot be negative');

    const currentTeam = await this.playerService.findCurrentTeam(data.playerId);

    if (
      data.fromTeamId === data.toTeamId &&
      data.type !== TransferType.YOUTH_PROMOTION
    )
      throw new BadRequestException(
        'The selling team cannot be the same as the buying team',
      );

    if (
      currentTeam &&
      currentTeam.teamId !== data.fromTeamId &&
      data.type !== TransferType.FREE_AGENT &&
      data.type !== TransferType.YOUTH_PROMOTION
    ) {
      throw new BadRequestException(
        'The player is not currently playing for the specified selling team.',
      );
    }

    switch (data.type) {
      case TransferType.TRANSFER:
      case TransferType.LOAN:
        if (!data.fromTeamId)
          throw new BadRequestException(
            'The player is not currently registered with any team.',
          );
        break;

      case TransferType.FREE_AGENT:
      case TransferType.YOUTH_PROMOTION:
        if (data.fromTeamId)
          throw new BadRequestException(
            'The player already belongs to a team.',
          );
        break;
    }

    return this.repo.completeTransfer(currentTeam, data);
  }

  async deleteTransfer(transferId: number) {
    await this.findTransferById(transferId);

    return this.repo.deleteTransfer(transferId);
  }
}
