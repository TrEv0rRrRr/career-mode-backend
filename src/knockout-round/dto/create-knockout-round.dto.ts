import { ApiProperty } from '@nestjs/swagger';
import { MatchType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateKnockoutRoundDto {
  @ApiProperty({
    example: 1,
    description: 'Represents the id of a competition edition.',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  competitionEditionId!: number;

  @ApiProperty({
    example: MatchType.FINAL,
    enum: MatchType,
    description: 'Represents the knockout round.',
  })
  @IsNotEmpty()
  @IsEnum(MatchType)
  @IsBoolean()
  type!: MatchType;

  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Represents the teams that have qualified for the next round',
  })
  @IsArray()
  @IsNotEmpty()
  qualifiedTeamIds!: number[];
}
