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
        capacity: match.stadium.capacity,
      },
      matchday: match.matchday,
      homePenaltyGoals: match.homePenaltyGoals,
      awayPenaltyGoals: match.awayPenaltyGoals,
      leg: match.leg,
      tieId: match.tieId,
      winnerTeamId: match.winnerTeamId,
      competitionEditionId: match.competitionEditionId,
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        logo: match.homeTeam.logo,
        country: match.homeTeam.country,
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        logo: match.awayTeam.logo,
        country: match.awayTeam.country,
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
      awayTeamId: match.awayTeam.id,
      competitionEditionId: match.competitionEditionId,
      finishType: match.finishType,
      homePenaltyGoals: match.homePenaltyGoals,
      homeTeamId: match.homeTeam.id,
      leg: match.leg,
      matchday: match.matchday,
      stadiumId: match.stadium.id,
      tieId: match.tieId,
      type: match.type,
      winnerTeamId: match.winnerTeamId,
    };
  }
}
