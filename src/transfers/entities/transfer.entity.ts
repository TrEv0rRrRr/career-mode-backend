import { TransferType } from '@prisma/client';

export class TransferEntity {
  id!: number;
  fee!: number;
  date!: Date;
  type!: TransferType;
  playerId!: number;
  seasonId!: number;
  fromTeamId?: number;
  toTeamId!: number;
}
