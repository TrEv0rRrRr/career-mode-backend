import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateMatchPlayerStatsDto } from './stats/create-match-player-stats.dto.ts';
import { CreateMatchClubStatsDto } from './stats/create-match-club-stats.dto.ts';
import { UpdateMatchDto } from './update-match.dto.ts';

export class PlayMatchDto {
  @ApiProperty({ type: () => UpdateMatchDto })
  @ValidateNested()
  @Type(() => UpdateMatchDto)
  match!: UpdateMatchDto;

  @ApiProperty({ type: () => CreateMatchPlayerStatsDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchPlayerStatsDto)
  playerStats!: CreateMatchPlayerStatsDto[];

  @ApiProperty({ type: () => CreateMatchClubStatsDto, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateMatchClubStatsDto)
  clubStats!: CreateMatchClubStatsDto[];
}
