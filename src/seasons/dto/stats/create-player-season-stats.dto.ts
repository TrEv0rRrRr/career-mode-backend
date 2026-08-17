import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePlayerSeasonStatsDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  playerId!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  teamId!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  seasonId!: number;
}
