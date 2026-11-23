import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { transformMatchTypeToKnockoutRoundType } from '../../../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { KnockoutRoundWithRelations } from '../../knockout-round.repository.ts';
import { KnockoutRoundResponseDto } from '../response/knockout-round-response.dto.ts';

export class KnockoutRoundMapper {
  static toResponse = (
    kR: KnockoutRoundWithRelations,
  ): KnockoutRoundResponseDto => {
    const qualifiedClubs: ClubSummary[] = kR.qualifiedClubs.map(({ club }) => ({
      id: club.id,
      name: club.name,
      logo: club.logo,
      country: club.country,
      confederation: club.confederation,
    }));

    return {
      id: kR.id,
      competitionEditionId: kR.competitionEditionId,
      completed: kR.completed,
      type: transformMatchTypeToKnockoutRoundType(kR.type),
      qualifiedClubs,
    };
  };
}
