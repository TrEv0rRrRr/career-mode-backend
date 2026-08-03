import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateMatchPlayerStatsDto } from './stats/create-match-player-stats.dto.ts';
import { CreateMatchTeamStatsDto } from './stats/create-match-team-stats.dto.ts';
import { UpdateMatchDto } from './update-match.dto.ts';

export class PlayMatchDto {
  @ValidateNested()
  @Type(() => UpdateMatchDto)
  match!: UpdateMatchDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchPlayerStatsDto)
  playerStats!: CreateMatchPlayerStatsDto[];

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateMatchTeamStatsDto)
  teamStats!: CreateMatchTeamStatsDto[];
}
