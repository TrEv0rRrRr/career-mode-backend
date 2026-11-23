import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
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
      'The id of the club that sold the player. Can be null in case of free agents or youth promotions.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  fromClubId?: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the club that signed the player',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  toClubId!: number;

  @ApiProperty({
    example: 1,
    description:
      'The jersey number that the player will be using in his new club',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber!: number;
}
