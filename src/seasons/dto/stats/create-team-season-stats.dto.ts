import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateTeamSeasonStatsDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  teamId!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  seasonId!: number;
}
