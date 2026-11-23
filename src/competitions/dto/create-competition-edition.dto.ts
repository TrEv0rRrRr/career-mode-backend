import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateCompetitionEditionDto {
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
