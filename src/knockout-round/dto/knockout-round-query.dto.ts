import { MatchType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class KnockoutRoundQueryDto {
  @IsInt()
  @IsNotEmpty()
  competitionEditionId!: number;

  @IsNotEmpty()
  @IsEnum(MatchType)
  type!: MatchType;
}
