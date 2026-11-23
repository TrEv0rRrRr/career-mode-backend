import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferType } from '@prisma/client';
import { PlayerNotFoundException } from '../players/exceptions/player-not-found.exception.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { CreateTransferDto } from './dto/create-transfer.dto.ts';

import { ClubNotFoundException } from '../clubs/exceptions/club-not-found.exception.ts';
import { SeasonNotFoundException } from '../seasons/exceptions/season-not-found.exception.ts';
import { TransferNotFoundException } from './exceptions/transfer-not-found.exception.ts';
import { TransfersRepository } from './transfers.repository.ts';

@Injectable()
export class TransfersService {
  constructor(
    private repo: TransfersRepository,
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

  async completeTransfer(data: CreateTransferDto, type: TransferType) {
    if (!(await this.repo.playerExists(data.playerId)))
      throw new PlayerNotFoundException();

    if (data.fromClubId && !(await this.repo.clubExists(data.fromClubId)))
      throw new ClubNotFoundException();

    if (!(await this.repo.clubExists(data.toClubId)))
      throw new ClubNotFoundException();

    const season = await this.seasonService.findSeasonById(data.seasonId);

    if (!season) throw new SeasonNotFoundException();

    if (data.date < season.startDate || data.date > season.endDate)
      throw new BadRequestException(
        'The transfer date must be within the selected season.',
      );

    if (0 > data.fee)
      throw new BadRequestException('The transfer fee cannot be negative');

    const currentClub = await this.repo.findCurrentClub(data.playerId);

    if (
      data.fromClubId === data.toClubId &&
      type !== TransferType.YOUTH_PROMOTION
    )
      throw new BadRequestException(
        'The selling club cannot be the same as the buying club',
      );

    if (
      currentClub &&
      currentClub.clubId !== data.fromClubId &&
      type !== TransferType.FREE_AGENT &&
      type !== TransferType.YOUTH_PROMOTION
    ) {
      throw new BadRequestException(
        'The player is not currently playing for the specified selling club.',
      );
    }

    switch (type) {
      case TransferType.TRANSFER:
      case TransferType.LOAN:
        if (!data.fromClubId)
          throw new BadRequestException(
            'The player is not currently registered with any club.',
          );
        break;

      case TransferType.FREE_AGENT:
      case TransferType.YOUTH_PROMOTION:
        if (data.fromClubId)
          throw new BadRequestException(
            'The player already belongs to a club.',
          );
        break;
    }

    return this.repo.completeTransfer(currentClub, data, type);
  }

  async deleteTransfer(transferId: number) {
    await this.findTransferById(transferId);

    return this.repo.deleteTransfer(transferId);
  }
}
