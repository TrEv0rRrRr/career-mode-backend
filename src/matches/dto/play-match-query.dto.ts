import { ApiProperty } from '@nestjs/swagger';
import { MatchFinishType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class PlayMatchQueryDto {
  @ApiProperty({
    example: MatchFinishType.PENALTIES,
    enum: MatchFinishType,
    description: 'The way the match ended',
  })
  @IsNotEmpty()
  @IsEnum(MatchFinishType)
  finishType!: MatchFinishType;
}
