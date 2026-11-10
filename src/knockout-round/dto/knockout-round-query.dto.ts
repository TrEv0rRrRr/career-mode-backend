import { IsEnum, IsNotEmpty } from 'class-validator';
import { KnockoutRoundType } from '../enums/KnockoutRoundType.ts';

export class KnockoutRoundQueryDto {
  @IsNotEmpty()
  @IsEnum(KnockoutRoundType)
  type!: KnockoutRoundType;
}
