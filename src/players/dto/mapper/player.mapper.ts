import { Player } from '@prisma/client';
import {
  PlayerClubs,
  PlayerClubSeasonStats,
  PlayerClubSeasonStatsResponseDto,
  PlayerClubsResponseDto,
  PlayerNationalTeam,
  PlayerNationalTeamResponseDto,
  PlayerPositions,
  PlayerPositionsResponseDto,
  PlayerResponseDto,
  PlayerSeasonStats,
  PlayerSeasonStatsResponseDto,
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

  static clubsToResponse(pt: PlayerClubs): PlayerClubsResponseDto {
    return {
      jerseyNumber: pt.jerseyNumber,
      startDate: pt.startDate,
      endDate: pt.endDate,
      club: {
        id: pt.clubId,
        name: pt.club.name,
        logo: pt.club.logo,
        country: pt.club.country,
        confederation: pt.club.confederation,
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

  static clubSeasonStatsToResponse(
    ptss: PlayerClubSeasonStats,
  ): PlayerClubSeasonStatsResponseDto {
    return {
      matches: ptss.matches,
      goals: ptss.goals,
      assists: ptss.assists,
      yellowCards: ptss.yellowCards,
      redCards: ptss.redCards,
      rating: Number(ptss.rating),
      season: ptss.season.code,
      club: {
        id: ptss.clubId,
        name: ptss.club.name,
        logo: ptss.club.logo,
        country: ptss.club.country,
        confederation: ptss.club.confederation,
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
