import { TeamWithRelations } from '../../teams.repository.ts';
import {
  PlayerTeamType,
  TeamPlayerSquadType,
  TeamPlayersResponseDto,
  TeamResponseDto,
  TeamSeasonStatsResponseDto,
  TeamSeasonStatsType,
  TeamSquadStatsResponseDto,
} from '../response/team-response.dto.ts';

export class TeamMapper {
  static toResponse(team: TeamWithRelations): TeamResponseDto {
    return {
      id: team.id,
      name: team.name,
      logo: team.logo,
      country: team.country,
      manager: team.manager.name,
      stadium: team.stadium.name,
      league: team.competition.name,
    };
  }

  static teamPlayerToResponse(pt: PlayerTeamType): TeamPlayersResponseDto {
    return {
      jerseyNumber: pt.jerseyNumber,
      startDate: pt.startDate,
      endDate: pt.endDate,
      player: pt.player,
    };
  }

  static teamSquadStatsToResponse(
    ts: TeamPlayerSquadType,
  ): TeamSquadStatsResponseDto {
    return {
      matches: ts.matches,
      goals: ts.goals,
      assists: ts.assists,
      yellowCards: ts.yellowCards,
      readCards: ts.redCards,
      rating: Number(ts.rating),
      player: {
        id: ts.playerId,
        name: ts.player.name,
        overall: ts.player.overall,
        nationality: ts.player.nationality,
        face: ts.player.face,
      },
    };
  }

  static teamSeasonStatsToResponse(
    tss: TeamSeasonStatsType,
  ): TeamSeasonStatsResponseDto {
    return {
      season: tss.season.code,
      played: tss.played,
      wins: tss.wins,
      draws: tss.draws,
      losses: tss.losses,
      gf: tss.gf,
      ga: tss.ga,
      gd: tss.gd,
    };
  }
}
