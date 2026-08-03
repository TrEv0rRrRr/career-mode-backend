import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateMatchTeamStatsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  teamId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  matchId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  possession!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  shots!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  shotsOnTarget!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  corners!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  fouls!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  offsides!: number;
}
