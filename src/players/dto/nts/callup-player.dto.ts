import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CallUpPlayerDto {
  @ApiProperty({
    example: 1,
    description: 'The jersey number that the player will be using',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber!: number;

  @ApiProperty({
    example: '2026-07-21',
    description: 'The date when the player was called up',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  startDate!: Date;

  @ApiProperty({
    example: '2030-07-21',
    description:
      "The date when the player left the national team. Can be null, which means that he's currently part of the national team.",
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
