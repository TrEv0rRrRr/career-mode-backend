import { TransferType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class TransferTypeQueryDto {
  @IsOptional()
  @IsEnum(TransferType)
  type?: TransferType;
}
