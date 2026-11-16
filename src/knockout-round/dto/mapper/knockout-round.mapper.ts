import { transformMatchTypeToKnockoutRoundType } from '../../../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { TeamResponse } from '../../../common/types/TeamResponse.ts';
import { KnockoutRoundWithRelations } from '../../knockout-round.repository.ts';
import { KnockoutRoundResponseDto } from '../response/knockout-round-response.dto.ts';

export class KnockoutRoundMapper {
  static toResponse = (
    kR: KnockoutRoundWithRelations,
  ): KnockoutRoundResponseDto => {
    const qualifiedTeams: TeamResponse[] = kR.qualifiedTeams.map(
      ({ team }) => ({
        id: team.id,
        name: team.name,
        logo: team.logo,
        country: team.country,
      }),
    );

    return {
      id: kR.id,
      competitionEditionId: kR.competitionEditionId,
      completed: kR.completed,
      type: transformMatchTypeToKnockoutRoundType(kR.type),
      qualifiedTeams,
    };
  };
}
