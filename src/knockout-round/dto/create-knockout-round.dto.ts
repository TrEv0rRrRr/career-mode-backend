import { ApiProperty } from '@nestjs/swagger';
import { MatchType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

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
}
