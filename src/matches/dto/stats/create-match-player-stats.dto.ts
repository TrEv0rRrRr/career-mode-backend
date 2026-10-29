import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateMatchPlayerStatsDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the player',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  playerId!: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  teamId!: number;

  @ApiProperty({
    example: 1,
    description: 'The number of goals',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  goals!: number;

  @ApiProperty({
    example: 2,
    description: 'The number of assists',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assists!: number;

  @ApiProperty({
    example: 5.0,
    description: 'The final rating of the player',
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(5)
  @Max(10)
  rating!: number;

  @ApiProperty({
    example: 1,
    description: 'The number of yellow cards the player received',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(2)
  yellowCards!: number;

  @ApiProperty({
    example: 0,
    description: 'The number of red cards the player received',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  redCards!: number;
}
