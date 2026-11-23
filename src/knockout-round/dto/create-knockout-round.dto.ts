import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

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
    description: 'Represents the clubs that have qualified for the next round',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  qualifiedClubs?: number[];

  @ApiProperty({
    example: [1, 2, 3, 4],
    description:
      'Represents the national teams that have qualified for the next round',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  qualifiedNationalTeams?: number[];
}
