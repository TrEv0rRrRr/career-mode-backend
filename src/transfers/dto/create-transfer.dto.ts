import { ApiProperty } from '@nestjs/swagger';
import { TransferType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    example: 90000000,
    description: 'The fee of the transfer',
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fee!: number;

  @ApiProperty({
    example: '2026-07-20',
    description: 'The date when the transfer was signed',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @ApiProperty({
    example: TransferType.FREE_AGENT,
    enum: TransferType,
    description: 'The type of the transfer',
  })
  @IsNotEmpty()
  @IsEnum(TransferType)
  type!: TransferType;

  @ApiProperty({
    example: 1,
    description: 'The id of the player',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  playerId!: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the season',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seasonId!: number;

  @ApiProperty({
    example: 1,
    description:
      'The id of the team that sold the player. Can be null in case of free agents or youth promotions.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  fromTeamId?: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the team that signed the player',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  toTeamId!: number;

  @ApiProperty({
    example: 1,
    description:
      'The jersey number that the player will be using in his new team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber!: number;
}
