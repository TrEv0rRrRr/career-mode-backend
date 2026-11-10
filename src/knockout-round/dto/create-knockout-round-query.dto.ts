import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { KnockoutRoundType } from '../enums/KnockoutRoundType.ts';

export class CreateKnockoutRoundQueryDto {
  @ApiProperty({
    example: KnockoutRoundType.FINAL,
    enum: KnockoutRoundType,
    description: 'Represents the knockout round.',
  })
  @IsNotEmpty()
  @IsEnum(KnockoutRoundType)
  type!: KnockoutRoundType;
}
