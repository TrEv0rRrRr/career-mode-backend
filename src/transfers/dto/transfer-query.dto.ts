import { TransferType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class TransferTypeOptionalQueryDto {
  @IsOptional()
  @IsEnum(TransferType)
  type?: TransferType;
}

export class TransferTypeRequiredQueryDto {
  @IsNotEmpty()
  @IsEnum(TransferType)
  type!: TransferType;
}
