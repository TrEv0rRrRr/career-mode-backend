import { ApiProperty } from '@nestjs/swagger';
import { MatchType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateKnockoutRoundQueryDto {
  @ApiProperty({
    example: MatchType.FINAL,
    enum: MatchType,
    description: 'Represents the knockout round.',
  })
  @IsNotEmpty()
  @IsEnum(MatchType)
  type!: MatchType;
}
