import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ClubQueryDto {
  @ApiPropertyOptional({
    example: 'Spain',
    description: 'The country where the club was founded',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 2,
    description:
      'The foreign key that connects the club to the league where it plays',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  leagueId?: number;
}
