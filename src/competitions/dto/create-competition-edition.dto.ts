import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCompetitionEditionDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the season on which the competition was played',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seasonId!: number;
}
