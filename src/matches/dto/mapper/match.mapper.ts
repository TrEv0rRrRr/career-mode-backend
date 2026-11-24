import { Match } from '@prisma/client';
import type {
  MatchWithRelations,
  TieWithMatches,
} from '../../matches.repository.ts';
import {
  MatchResponseDto,
  MatchesWithTieResponseDto,
} from '../response/match-response.dto.ts';

export class MatchMapper {
  static toResponse(match: MatchWithRelations): MatchResponseDto {
    return {
      id: match.id,
      date: match.date,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      status: match.status,
      stadium: {
        id: match.stadium.id,
        name: match.stadium.name,
        image: match.stadium.image,
        country: match.stadium.country,
      },
      competition: {
        id: match.competitionEdition.competitionId,
        name: match.competitionEdition.competition.name,
        logo: match.competitionEdition.competition.logo,
      },
      matchday: match.matchday,
      homePenaltyGoals: match.homePenaltyGoals,
      awayPenaltyGoals: match.awayPenaltyGoals,
      leg: match.leg,
      tieId: match.tieId,
      homeClubId: match.homeClubId,
      awayClubId: match.awayClubId,
      winnerClubId: match.winnerClubId,
      homeNationalTeamId: match.homeNationalTeamId,
      awayNationalTeamId: match.awayNationalTeamId,
      winnerNationalTeamId: match.winnerNationalTeamId,
      competitionEditionId: match.competitionEditionId,
      homeClub: match.homeClub && {
        id: match.homeClub.id,
        name: match.homeClub.name,
        logo: match.homeClub.logo,
        country: match.homeClub.country,
        confederation: match.homeClub.confederation,
      },
      awayClub: match.awayClub && {
        id: match.awayClub.id,
        name: match.awayClub.name,
        logo: match.awayClub.logo,
        country: match.awayClub.country,
        confederation: match.awayClub.confederation,
      },
      homeNationalTeam: match.homeNationalTeam && {
        id: match.homeNationalTeam.id,
        name: match.homeNationalTeam.name,
        logo: match.homeNationalTeam.logo,
        confederation: match.homeNationalTeam.confederation,
      },
      awayNationalTeam: match.awayNationalTeam && {
        id: match.awayNationalTeam.id,
        name: match.awayNationalTeam.name,
        logo: match.awayNationalTeam.logo,
        confederation: match.awayNationalTeam.confederation,
      },
      type: match.type,
      finishType: match.finishType,
    };
  }

  static toResponseWithTie(tie: TieWithMatches): MatchesWithTieResponseDto {
    return {
      tieId: tie.id,
      knockoutRoundId: tie.knockoutRoundId,
      matches: tie.matches.map((match) => MatchMapper.toResponse(match)),
    };
  }

  static toModelFromResponse(match: MatchResponseDto): Match {
    return {
      id: match.id,
      date: match.date,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      status: match.status,
      awayPenaltyGoals: match.awayPenaltyGoals,
      awayClubId: match.awayClubId,
      competitionEditionId: match.competitionEditionId,
      finishType: match.finishType,
      homePenaltyGoals: match.homePenaltyGoals,
      homeClubId: match.homeClubId,
      leg: match.leg,
      matchday: match.matchday,
      stadiumId: match.stadium.id,
      tieId: match.tieId,
      type: match.type,
      winnerClubId: match.winnerClubId,
      homeNationalTeamId: match.homeNationalTeamId,
      awayNationalTeamId: match.awayNationalTeamId,
      winnerNationalTeamId: match.winnerNationalTeamId,
    };
  }
}
