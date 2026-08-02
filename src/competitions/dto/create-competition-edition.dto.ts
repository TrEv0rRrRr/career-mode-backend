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
    description:
      'The id of the stadium where the final will be played if the competition have one.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  finalStadiumId?: number;
}
