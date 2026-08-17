import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdatePlayerSeasonStatsDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  matches?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  goals?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  assists?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  yellowCards?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  redCards?: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(5)
  @Max(10)
  @IsOptional()
  rating?: number;
}
