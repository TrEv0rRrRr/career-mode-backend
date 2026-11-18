import { Confederation } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class NationalTeamQueryDto {
  @IsOptional()
  @IsEnum(Confederation)
  confederation?: Confederation;
}
