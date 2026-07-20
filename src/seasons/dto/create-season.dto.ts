import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({
    example: '26/27',
    description: 'This is the seasonal year.',
  })
  @IsNotEmpty()
  @IsString()
  year!: string;

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
