import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsSeasonYear } from '../../common/validators/is-season-year.validator.ts';

export class CreateSeasonDto {
  @ApiProperty({
    example: '2025/2026',
    description: 'This is a code for the season. It should be year1/year2.',
  })
  @IsSeasonYear()
  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  @MinLength(1)
  code!: string;

  @ApiProperty({
    example: 'Barça treble',
    description:
      'This is a little description of the season. Completely optional.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 1,
    description: 'The foreign key that connects my master league with a season',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  careerId!: number;
}
