import {
  CompetitionFormat,
  CompetitionType,
  Confederation,
} from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { Optional } from '../../../common/types/Optional.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';
import { StadiumSummary } from '../../../stadiums/dto/response/stadiums.response.ts';

export type LeagueStandings = {
  club: {
    id: number;
    name: string;
    logo: string | null;
    shortName: string;
    country: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    leagueId: number;
    confederation: Confederation;
  };
} & {
  clubId: number;
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

export type ParticipantClubType = {
  club: {
    id: number;
    name: string;
    logo: string | null;
    shortName: string;
    country: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    leagueId: number;
    confederation: Confederation;
  };
} & {
  clubId: number;
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

class ParticipantTeam {
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
}

export class ParticipantClub extends ParticipantTeam {
  club!: ClubSummary;
}

export class ParticipantNationalTeam extends ParticipantTeam {
  nationalTeam!: NationalTeamSummary;
}

export class CompetitionResponseDto {
  id!: number;
  name!: string;
  logo!: string | null;
  type!: CompetitionType;
  format!: CompetitionFormat;
}

export type CompetitionSummary = Omit<
  CompetitionResponseDto,
  'type' | 'format'
>;

export class CompetitionEditionResponseDto {
  id!: number;
  season!: string;
  competition!: CompetitionResponseDto;
  finalStadium!: Optional<StadiumSummary>;
  winnerClub?: Optional<ClubSummary>;
  runnerUpClub?: Optional<ClubSummary>;
  winnerNationalTeam?: Optional<NationalTeamSummary>;
  runnerUpNationalTeam?: Optional<NationalTeamSummary>;
  participantClubs?: ParticipantClub[];
  participantNationalTeams?: ParticipantNationalTeam[];
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
  club!: ClubSummary;
}
