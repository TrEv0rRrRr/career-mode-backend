import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { KnockoutRoundType } from '../../enums/KnockoutRoundType.ts';

export class KnockoutRoundResponseDto {
  id!: number;
  competitionEditionId!: number;
  type!: KnockoutRoundType;
  completed!: boolean;
  qualifiedClubs!: ClubSummary[];
}
