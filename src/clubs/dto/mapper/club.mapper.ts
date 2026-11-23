import { ClubWithRelations } from '../../clubs.repository.ts';
import {
  ClubPlayerSquadType,
  ClubPlayersResponseDto,
  ClubResponseDto,
  ClubSeasonStatsResponseDto,
  ClubSeasonStatsType,
  ClubSquadStatsResponseDto,
  CurrentManagerClubResponseDto,
  ManagerClubType,
  PlayerClubType,
} from '../response/club-response.dto.ts';

export class ClubMapper {
  static toResponse(club: ClubWithRelations): ClubResponseDto {
    return {
      id: club.id,
      name: club.name,
      logo: club.logo,
      country: club.country,
      confederation: club.confederation,
      manager: club.managerClubs[0]?.manager.name ?? null,
      stadium: club.stadium.name,
      league: club.competition.name,
    };
  }

  static clubPlayerToResponse(pt: PlayerClubType): ClubPlayersResponseDto {
    return {
      id: pt.id,
      jerseyNumber: pt.jerseyNumber,
      startDate: pt.startDate,
      endDate: pt.endDate,
      player: pt.player,
    };
  }

  static clubSquadStatsToResponse(
    ts: ClubPlayerSquadType,
  ): ClubSquadStatsResponseDto {
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

  static clubSeasonStatsToResponse(
    tss: ClubSeasonStatsType,
  ): ClubSeasonStatsResponseDto {
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

  static mapManagers(mt: ManagerClubType): CurrentManagerClubResponseDto {
    return {
      id: mt.id,
      clubId: mt.clubId,
      startDate: mt.startDate,
      endDate: mt.endDate,
      manager: {
        id: mt.managerId,
        name: mt.manager.name,
        face: mt.manager.face,
        nationality: mt.manager.nationality,
      },
    };
  }
}
