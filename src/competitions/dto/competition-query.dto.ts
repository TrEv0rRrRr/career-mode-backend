import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class CompetitionQueryDto {
  @IsOptional()
  @IsEnum(CompetitionType)
  type?: CompetitionType;

  @IsOptional()
  @IsEnum(CompetitionFormat)
  format?: CompetitionFormat;
}
