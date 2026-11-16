import { Player } from '@prisma/client';
import {
  PlayerPositions,
  PlayerPositionsResponseDto,
  PlayerResponseDto,
  PlayerTeams,
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
}
