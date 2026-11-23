import { SeasonWithRelations } from '../../seasons.repository.ts';
import {
  ClubSeasonStatsResponse,
  CompetitionEditionsResponse,
  SeasonResponseDto,
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
      fromClub: {
        id: transfer.fromClubId,
        name: transfer.fromClub?.name,
        logo: transfer.fromClub?.logo,
        country: transfer.fromClub?.country,
        confederation: transfer.fromClub?.confederation,
      },
      toClub: {
        id: transfer.toClubId,
        name: transfer.toClub?.name,
        logo: transfer.toClub?.logo,
        country: transfer.toClub?.country,
        confederation: transfer.toClub?.confederation,
      },
    }));
    const clubSeasonStats: ClubSeasonStatsResponse[] =
      season.clubSeasonStats.map((tss) => ({
        played: tss.played,
        wins: tss.wins,
        draws: tss.draws,
        losses: tss.losses,
        gf: tss.gf,
        ga: tss.ga,
        gd: tss.gd,
        club: {
          id: tss.clubId,
          name: tss.club.name,
          logo: tss.club.logo,
          country: tss.club.country,
          confederation: tss.club.confederation,
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
        winnerClub: {
          id: cE.winnerClubId,
          name: cE.winnerClub?.name,
          logo: cE.winnerClub?.logo,
          country: cE.winnerClub?.country,
          confederation: cE.winnerClub?.confederation,
        },
        winnerNationalTeam: {
          id: cE.winnerNationalTeamId,
          name: cE.winnerNationalTeam?.name,
          logo: cE.winnerNationalTeam?.logo,
          confederation: cE.winnerNationalTeam?.confederation,
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
      clubSeasonStats,
      competitionEditions,
    };
  }

  static clubSeasonStatsToResponse(c: TSS): ClubSeasonStatsResponse {
    return {
      played: c.played,
      wins: c.wins,
      draws: c.draws,
      losses: c.losses,
      gf: c.gf,
      ga: c.ga,
      gd: c.gd,
      club: {
        id: c.clubId,
        name: c.club.name,
        logo: c.club.logo,
        country: c.club.country,
        confederation: c.club.confederation,
      },
    };
  }
}
