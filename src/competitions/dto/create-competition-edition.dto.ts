import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateCompetitionEditionDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the season on which the competition was played',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seasonId!: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the winner team',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  winnerTeamId?: number;

  @ApiProperty({
    example: 2,
    description: 'The id of the runner up team',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  runnerUpTeamId?: number;
}
