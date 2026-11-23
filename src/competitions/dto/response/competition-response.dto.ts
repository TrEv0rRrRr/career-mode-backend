import {
  CompetitionFormat,
  CompetitionType,
  Confederation,
} from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { Optional } from '../../../seasons/dto/response/season-response.dto.ts';

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
export class ParticipantClub {
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
  club!: ClubSummary;
}

export class ParticipantNationalTeam {
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
  nationalTeam!: {
    id: number;
    name: string;
    logo: string | null;
    confederation: Confederation;
  };
}

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
  finalStadium!: {
    id: number | null | undefined;
    name: string | null | undefined;
    image: string | null | undefined;
    country: string | null | undefined;
  };
  winnerClub!: Optional<ClubSummary>;
  runnerUpClub!: Optional<ClubSummary>;
  winnerNationalTeam!: Optional<{
    id: number;
    name: string;
    logo: string | null;
    confederation: Confederation;
  }>;
  runnerUpNationalTeam!: Optional<{
    id: number;
    name: string;
    logo: string | null;
    confederation: Confederation;
  }>;
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
