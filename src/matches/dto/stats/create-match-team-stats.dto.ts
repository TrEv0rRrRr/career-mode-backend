import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateMatchTeamStatsDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  teamId!: number;

  @ApiProperty({
    example: 50,
    description:
      'The percentage of possession the team got when the match finished',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  possession!: number;

  @ApiProperty({
    example: 8,
    description: 'The number of shots',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  shots!: number;

  @ApiProperty({
    example: 5,
    description: 'The number of shots on target',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  shotsOnTarget!: number;

  @ApiProperty({
    example: 3,
    description: 'The number of corners',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  corners!: number;

  @ApiProperty({
    example: 10,
    description: 'The number of fouls',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  fouls!: number;

  @ApiProperty({
    example: 2,
    description: 'The number of offsides',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  offsides!: number;
}
