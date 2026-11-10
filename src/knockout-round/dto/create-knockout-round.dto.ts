import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateKnockoutRoundDto {
  @ApiProperty({
    example: 1,
    description: 'Represents the id of a competition edition.',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  competitionEditionId!: number;

  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Represents the teams that have qualified for the next round',
  })
  @IsArray()
  @IsNotEmpty()
  qualifiedTeams!: number[];
}
