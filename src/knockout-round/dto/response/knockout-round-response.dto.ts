import { TeamResponse } from '../../../teams/dto/response/team-response.dto.ts';
import { KnockoutRoundType } from '../../enums/KnockoutRoundType.ts';

export class KnockoutRoundResponseDto {
  id!: number;
  competitionEditionId!: number;
  type!: KnockoutRoundType;
  completed!: boolean;
  qualifiedTeams!: TeamResponse[];
}
