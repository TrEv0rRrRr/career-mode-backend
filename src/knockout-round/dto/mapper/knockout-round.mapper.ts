import { transformMatchTypeToKnockoutRoundType } from '../../../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { KnockoutRoundWithRelations } from '../../knockout-round.repository.ts';
import {
  KnockoutQualifiedTeam,
  KnockoutRoundResponseDto,
} from '../response/knockout-round-response.dto.ts';

export class KnockoutRoundMapper {
  static toResponse = (
    kR: KnockoutRoundWithRelations,
  ): KnockoutRoundResponseDto => {
    const qualifiedTeams: KnockoutQualifiedTeam[] = kR.qualifiedTeams.map(
      ({ team }) => ({
        teamId: team.id,
        team: {
          name: team.name,
          logo: team.logo,
          country: team.country,
        },
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
