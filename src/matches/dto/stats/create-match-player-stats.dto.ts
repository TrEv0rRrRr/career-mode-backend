import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateMatchPlayerStatsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  matchId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  playerId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  goals!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assists!: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(5)
  @Max(10)
  rating!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  yellowCards!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  redCards!: number;
}
