import { Competition, CompetitionType } from '@prisma/client';
import { CompetitionEditionWithRelations } from '../../competitions.repository.ts';
import {
  CompetitionEditionResponseDto,
  CompetitionResponseDto,
  LeagueStandings,
  LeagueStandingsResponseDto,
  ParticipantClub,
  ParticipantClubType,
} from '../response/competition-response.dto.ts';

export class CompetitionMapper {
  static toResponse(competition: Competition): CompetitionResponseDto {
    return {
      id: competition.id,
      name: competition.name,
      logo: competition.logo,
      type: competition.type,
      format: competition.format,
    };
  }

  static editionsToResponse(
    cE: CompetitionEditionWithRelations,
  ): CompetitionEditionResponseDto {
    const isANationalTeamsCompetition =
      cE.competition.type === CompetitionType.NATIONAL_TEAMS;

    const participantClubs: ParticipantClub[] = cE.competitionParticipants.map(
      (pt) => ({
        points: pt.points,
        position: pt.position,
        group: pt.group,
        played: pt.played,
        wins: pt.wins,
        draws: pt.draws,
        losses: pt.losses,
        gf: pt.gf,
        ga: pt.ga,
        gd: pt.gd,
        club: {
          id: pt.clubId,
          name: pt.club.name,
          logo: pt.club.logo,
          country: pt.club.country,
          confederation: pt.club.confederation,
        },
      }),
    );
    const participantNationalTeams = cE.nationalTeamParticipants.map(
      (participant) => ({
        points: participant.points,
        position: participant.position,
        group: participant.group,
        played: participant.played,
        wins: participant.wins,
        draws: participant.draws,
        losses: participant.losses,
        gf: participant.gf,
        ga: participant.ga,
        gd: participant.gd,
        nationalTeam: {
          id: participant.nationalTeamId,
          name: participant.nationalTeam.name,
          logo: participant.nationalTeam.logo,
          confederation: participant.nationalTeam.confederation,
        },
      }),
    );

    return {
      id: cE.id,
      season: cE.season.code,
      competition: {
        id: cE.competitionId,
        name: cE.competition.name,
        logo: cE.competition.logo,
      },
      finalStadium: {
        id: cE.finalStadiumId,
        name: cE.stadium?.name,
        image: cE.stadium?.image,
        country: cE.stadium?.country,
      },
      winnerClub: {
        id: cE.winnerClubId,
        name: cE.winnerClub?.name,
        logo: cE.winnerClub?.logo,
        country: cE.winnerClub?.country,
        confederation: cE.winnerClub?.confederation,
      },
      runnerUpClub: {
        id: cE.runnerUpClubId,
        name: cE.runnerUpClub?.name,
        logo: cE.runnerUpClub?.logo,
        country: cE.runnerUpClub?.country,
        confederation: cE.runnerUpClub?.confederation,
      },
      ...(isANationalTeamsCompetition
        ? {
            participantNationalTeams,
          }
        : { participantClubs }),
    };
  }

  static mapParticipantClubs(pt: ParticipantClubType): ParticipantClub {
    return {
      points: pt.points,
      position: pt.position,
      group: pt.group,
      played: pt.played,
      wins: pt.wins,
      draws: pt.draws,
      losses: pt.losses,
      gf: pt.gf,
      ga: pt.ga,
      gd: pt.gd,
      club: {
        id: pt.clubId,
        name: pt.club.name,
        logo: pt.club.logo,
        country: pt.club.country,
        confederation: pt.club.confederation,
      },
    };
  }

  static mapLeagueStandings(
    leagueStandings: LeagueStandings,
  ): LeagueStandingsResponseDto {
    return {
      points: leagueStandings.points,
      position: leagueStandings.position,
      played: leagueStandings.played,
      wins: leagueStandings.wins,
      draws: leagueStandings.draws,
      losses: leagueStandings.losses,
      gf: leagueStandings.gf,
      ga: leagueStandings.ga,
      gd: leagueStandings.gd,
      club: {
        id: leagueStandings.clubId,
        name: leagueStandings.club.name,
        logo: leagueStandings.club.logo,
        country: leagueStandings.club.country,
        confederation: leagueStandings.club.confederation,
      },
    };
  }
}
