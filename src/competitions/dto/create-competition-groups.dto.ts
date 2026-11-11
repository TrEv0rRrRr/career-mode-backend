import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateCompetitionGroupsDto {
  @ApiProperty({
    example: {
      A: [1, 2, 3, 4],
      B: [5, 6, 7, 8],
    },
  })
  @IsNotEmpty()
  @IsObject()
  groups!: Record<string, number[]>;
}
