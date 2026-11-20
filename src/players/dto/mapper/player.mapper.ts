import { Player } from '@prisma/client';
import {
  PlayerNationalTeam,
  PlayerNationalTeamResponseDto,
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
      jerseyNumber: pt.jerseyNumber,
      startDate: pt.startDate,
      endDate: pt.endDate,
      team: {
        id: pt.teamId,
        name: pt.team.name,
        logo: pt.team.logo,
        country: pt.team.country,
        confederation: pt.team.confederation,
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
        id: ptss.teamId,
        name: ptss.team.name,
        logo: ptss.team.logo,
        country: ptss.team.country,
        confederation: ptss.team.confederation,
      },
    };
  }

  static nationalTeamsToResponse(
    pnt: PlayerNationalTeam,
  ): PlayerNationalTeamResponseDto {
    return {
      id: pnt.id,
      jerseyNumber: pnt.jerseyNumber,
      startDate: pnt.startDate,
      endDate: pnt.endDate,
      nationalTeam: {
        id: pnt.nationalTeamId,
        name: pnt.nationalTeam.name,
        logo: pnt.nationalTeam.logo,
        confederation: pnt.nationalTeam.confederation,
      },
    };
  }
}
