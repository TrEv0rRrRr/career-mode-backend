import { TeamResponse } from '../../../common/types/TeamResponse.ts';
import { KnockoutRoundType } from '../../enums/KnockoutRoundType.ts';

export class KnockoutRoundResponseDto {
  id!: number;
  competitionEditionId!: number;
  type!: KnockoutRoundType;
  completed!: boolean;
  qualifiedTeams!: TeamResponse[];
}
