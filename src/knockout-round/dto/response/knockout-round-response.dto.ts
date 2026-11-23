import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { Confederation } from '@prisma/client';
import { KnockoutRoundType } from '../../enums/KnockoutRoundType.ts';

export class KnockoutRoundResponseDto {
  id!: number;
  competitionEditionId!: number;
  type!: KnockoutRoundType;
  completed!: boolean;
  qualifiedClubs!: ClubSummary[];
  qualifiedNationalTeams!: {
    id: number;
    name: string;
    logo: string | null;
    confederation: Confederation;
  }[];
}
