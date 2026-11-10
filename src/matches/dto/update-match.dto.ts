import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateMatchDto {
  @ApiProperty({
    example: 2,
    description: 'The number of goals the home team scored',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  homeGoals!: number;

  @ApiProperty({
    example: 0,
    description: 'The number of goals the away team scored',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  awayGoals!: number;

  @ApiProperty({
    example: 4,
    description:
      'In case of penalties, this is the number the home team scored',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  homePenaltyGoals?: number;

  @ApiProperty({
    example: 3,
    description:
      'In case of penalties, this is the number the away team scored',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  awayPenaltyGoals?: number;
}
