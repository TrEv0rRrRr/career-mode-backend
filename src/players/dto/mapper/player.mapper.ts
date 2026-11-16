import { Player } from '@prisma/client';
import {
  PlayerPositions,
  PlayerPositionsResponseDto,
  PlayerResponseDto,
  PlayerSeasonStats,
  PlayerSeasonStatsResponseDto,
  PlayerTeams,
  PlayerTeamSeasonStats,
  PlayerTeamSeasonStatsResponseDto,
  PlayerTeamsResponseDto,
} from '../response/player-response.dto.ts';

export class PlayerMapper {
  static toResponse(player: Player): PlayerResponseDto {
    return {
      id: player.id,
      name: player.name,
      birthDate: player.birthDate,
      nationality: player.nationality,
      preferredFoot: player.preferredFoot,
      face: player.face,
      overall: player.overall,
      weight: player.weight,
      height: Number(player.height),
    };
  }

  static positionsToResponse(pp: PlayerPositions): PlayerPositionsResponseDto {
    return {
      name: pp.position.name,
      code: pp.position.code,
      isPrimary: pp.isPrimary,
    };
  }

  static teamsToResponse(pt: PlayerTeams): PlayerTeamsResponseDto {
    return {
      teamId: pt.teamId,
      jerseyNumber: pt.jerseyNumber,
      startDate: pt.startDate,
      endDate: pt.endDate,
      team: {
        name: pt.team.name,
        logo: pt.team.logo,
        country: pt.team.country,
      },
    };
  }

  static seasonStatsToResponse(
    pss: PlayerSeasonStats,
  ): PlayerSeasonStatsResponseDto {
    return {
      matches: pss.matches,
      goals: pss.goals,
      assists: pss.assists,
      yellowCards: pss.yellowCards,
      redCards: pss.redCards,
      rating: Number(pss.rating),
      season: pss.season.code,
    };
  }

  static teamSeasonStatsToResponse(
    ptss: PlayerTeamSeasonStats,
  ): PlayerTeamSeasonStatsResponseDto {
    return {
      matches: ptss.matches,
      goals: ptss.goals,
      assists: ptss.assists,
      yellowCards: ptss.yellowCards,
      redCards: ptss.redCards,
      rating: Number(ptss.rating),
      season: ptss.season.code,
      team: {
        name: ptss.team.name,
        logo: ptss.team.logo,
        country: ptss.team.country,
      },
    };
  }
}
