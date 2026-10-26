import { MatchType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class KnockoutRoundQueryDto {
  @IsNotEmpty()
  @IsEnum(MatchType)
  type!: MatchType;
}
