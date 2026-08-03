import { ApiProperty } from '@nestjs/swagger';
import { MatchLeg } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({
    example: '2026-07-25',
    description: 'The date of the match',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date!: Date;

  @ApiProperty({
    example: 1,
    description: 'The id of the stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  stadiumId!: number;

  @ApiProperty({
    example: 10,
    description: 'The matchday number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  matchday?: number;

  @ApiProperty({
    example: MatchLeg.FIRST,
    enum: MatchLeg,
    description:
      'In case the competition has home/away matches, this is the way to identify which match goes first.',
  })
  @IsOptional()
  @IsEnum(MatchLeg)
  leg?: MatchLeg;

  @ApiProperty({
    example: 1,
    description: 'The id of the home team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  homeTeamId!: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the away team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  awayTeamId!: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the competition edition this match belongs to',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  competitionEditionId!: number;
}
