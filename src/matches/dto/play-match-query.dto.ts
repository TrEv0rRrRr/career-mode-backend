import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchFinishType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class PlayMatchQueryDto {
  @ApiProperty({
    example: MatchFinishType.PENALTIES,
    enum: MatchFinishType,
    description: 'The way the match ended',
  })
  @IsNotEmpty()
  @IsEnum(MatchFinishType)
  finishType!: MatchFinishType;

  @ApiPropertyOptional({
    example: 8,
    description: 'The tie id associated with this matches',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  tieId?: number;
}
