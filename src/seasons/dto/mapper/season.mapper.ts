import { SeasonWithRelations } from '../../seasons.repository.ts';
import {
  CompetitionEditionsResponse,
  SeasonResponseDto,
  TeamSeasonStatsResponse,
  TransfersResponse,
  TSS,
} from '../response/season-response.dto.ts';

export class SeasonMapper {
  static toResponse(season: SeasonWithRelations): SeasonResponseDto {
    const transfers: TransfersResponse[] = season.transfers.map((transfer) => ({
      id: transfer.id,
      fee: Number(transfer.fee),
      date: transfer.date,
      type: transfer.type,
      player: {
        id: transfer.playerId,
        name: transfer.player.name,
        nationality: transfer.player.nationality,
        face: transfer.player.face,
      },
      fromTeam: {
        id: transfer.fromTeamId,
        name: transfer.fromTeam?.name,
        logo: transfer.fromTeam?.logo,
        country: transfer.fromTeam?.country,
      },
      toTeam: {
        id: transfer.toTeamId,
        name: transfer.toTeam?.name,
        logo: transfer.toTeam?.logo,
        country: transfer.toTeam?.country,
      },
    }));
    const teamSeasonStats: TeamSeasonStatsResponse[] =
      season.teamSeasonStats.map((tss) => ({
        played: tss.played,
        wins: tss.wins,
        draws: tss.draws,
        losses: tss.losses,
        gf: tss.gf,
        ga: tss.ga,
        gd: tss.gd,
        team: {
          id: tss.teamId,
          name: tss.team.name,
          logo: tss.team.logo,
          country: tss.team.country,
        },
      }));
    const competitionEditions: CompetitionEditionsResponse[] =
      season.competitionEditions.map((cE) => ({
        id: cE.id,
        competition: {
          id: cE.competitionId,
          name: cE.competition.name,
          logo: cE.competition.logo,
        },
        winnerTeam: {
          id: cE.winnerTeamId,
          name: cE.winnerTeam?.name,
          logo: cE.winnerTeam?.logo,
          country: cE.winnerTeam?.country,
        },
      }));

    return {
      id: season.id,
      code: season.code,
      notes: season.notes,
      startDate: season.startDate,
      endDate: season.endDate,
      careerId: season.careerId,
      transfers,
      teamSeasonStats,
      competitionEditions,
    };
  }

  static teamSeasonStatsToResponse(t: TSS): TeamSeasonStatsResponse {
    return {
      played: t.played,
      wins: t.wins,
      draws: t.draws,
      losses: t.losses,
      gf: t.gf,
      ga: t.ga,
      gd: t.gd,
      team: {
        id: t.teamId,
        name: t.team.name,
        logo: t.team.logo,
        country: t.team.country,
      },
    };
  }
}
