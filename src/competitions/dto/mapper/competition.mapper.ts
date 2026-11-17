import { Competition } from '@prisma/client';
import { CompetitionEditionWithRelations } from '../../competitions.repository.ts';
import {
  CompetitionEditionResponseDto,
  CompetitionResponseDto,
  LeagueStandings,
  LeagueStandingsResponseDto,
  ParticipantTeam,
  ParticipantTeamType,
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
    const participantTeams: ParticipantTeam[] = cE.competitionParticipants.map(
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
        team: {
          id: pt.teamId,
          name: pt.team.name,
          logo: pt.team.logo,
          country: pt.team.country,
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
      winnerTeam: {
        id: cE.winnerTeamId,
        name: cE.winnerTeam?.name,
        logo: cE.winnerTeam?.logo,
        country: cE.winnerTeam?.country,
      },
      runnerUpTeam: {
        id: cE.runnerUpTeamId,
        name: cE.runnerUpTeam?.name,
        logo: cE.runnerUpTeam?.logo,
        country: cE.runnerUpTeam?.country,
      },
      participantTeams,
    };
  }

  static mapParticipantTeams(pt: ParticipantTeamType): ParticipantTeam {
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
      team: {
        id: pt.teamId,
        name: pt.team.name,
        logo: pt.team.logo,
        country: pt.team.country,
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
      team: {
        id: leagueStandings.teamId,
        name: leagueStandings.team.name,
        logo: leagueStandings.team.logo,
        country: leagueStandings.team.country,
      },
    };
  }
}
