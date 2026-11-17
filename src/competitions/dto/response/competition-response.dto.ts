import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { Optional } from '../../../seasons/dto/response/season-response.dto.ts';
import { TeamResponse } from '../../../teams/dto/response/team-response.dto.ts';

export type LeagueStandings = {
  team: {
    id: number;
    name: string;
    logo: string | null;
    shortName: string;
    country: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    managerId: number;
    leagueId: number;
  };
} & {
  teamId: number;
  competitionEditionId: number;
  points: number | null;
  position: number | null;
  group: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};
export class ParticipantTeam {
  points!: number | null;
  position!: number | null;
  group!: string | null;
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  team!: TeamResponse;
}

export type ParticipantTeamType = {
  team: {
    id: number;
    name: string;
    logo: string | null;
    shortName: string;
    country: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    managerId: number;
    leagueId: number;
  };
} & {
  teamId: number;
  competitionEditionId: number;
  points: number | null;
  position: number | null;
  group: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

export class CompetitionResponse {
  id!: number;
  name!: string;
  logo!: string | null;
}

export class CompetitionResponseDto extends CompetitionResponse {
  type!: CompetitionType;
  format!: CompetitionFormat;
}

export class CompetitionEditionResponseDto {
  id!: number;
  season!: string;
  competition!: CompetitionResponse;
  winnerTeam!: Optional<TeamResponse>;
  runnerUpTeam!: Optional<TeamResponse>;
  participantTeams!: ParticipantTeam[];
}

export class LeagueStandingsResponseDto {
  points!: number | null;
  position!: number | null;
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  team!: TeamResponse;
}
