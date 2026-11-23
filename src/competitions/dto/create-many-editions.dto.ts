import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateManyEditionsDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the competition whose edition will be created',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  competitionId!: number;

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
