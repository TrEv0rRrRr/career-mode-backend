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

export class AssignTeamDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  teamId!: number;

  @ApiProperty({
    example: 1,
    description:
      'The jersey number that the player will be using in his new team',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber!: number;

  @ApiProperty({
    example: '2026-07-21',
    description: 'The date when the player was signed',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  startDate!: Date;

  @ApiProperty({
    example: '2030-07-21',
    description:
      "The date when the player leaved the club. Can be null, which means that he's currently playing for that club.",
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
