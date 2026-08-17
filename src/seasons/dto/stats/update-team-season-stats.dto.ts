import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTeamSeasonStatsDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  played?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wins?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  draws?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  losses?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  gf?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  ga?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  gd?: number;
}
