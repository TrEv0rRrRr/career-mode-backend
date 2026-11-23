import { Confederation, PreferredFoot } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';

export type PlayerPositions = {
  position: {
    id: number;
    name: string;
    code: string;
  };
} & {
  playerId: number;
  positionId: number;
  isPrimary: boolean;
};

export type PlayerClubs = {
  club: {
    id: number;
    name: string;
    shortName: string;
    country: string;
    logo: string | null;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    leagueId: number;
    confederation: Confederation;
  };
} & {
  id: number;
  playerId: number;
  clubId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
};

export type PlayerSeasonStats = {
  season: {
    id: number;
    startDate: Date;
    endDate: Date;
    code: string;
    notes: string | null;
    careerId: number;
  };
} & {
  playerId: number;
  clubId: number;
  seasonId: number;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: Decimal;
};

export type PlayerClubSeasonStats = {
  club: {
    id: number;
    name: string;
    shortName: string;
    country: string;
    logo: string | null;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    leagueId: number;
    confederation: Confederation;
  };
  season: {
    id: number;
    startDate: Date;
    endDate: Date;
    code: string;
    notes: string | null;
    careerId: number;
  };
} & {
  playerId: number;
  clubId: number;
  matches: number;
  seasonId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: Decimal;
};

export type PlayerNationalTeam = {
  nationalTeam: {
    name: string;
    id: number;
    shortName: string;
    confederation: Confederation;
    logo: string | null;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
  };
} & {
  id: number;
  playerId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
  nationalTeamId: number;
};

export class PlayerResponseDto {
  id!: number;
  name!: string;
  birthDate!: Date;
  nationality!: string;
  preferredFoot!: PreferredFoot;
  overall!: number;
  height!: number;
  weight!: number;
  face!: string | null;
}

export class PlayerPositionsResponseDto {
  code!: string;
  name!: string;
  isPrimary!: boolean;
}

export class PlayerSeasonStatsResponseDto {
  matches!: number;
  goals!: number;
  assists!: number;
  yellowCards!: number;
  redCards!: number;
  rating!: number;
  season!: string;
}

export class PlayerClubSeasonStatsResponseDto extends PlayerSeasonStatsResponseDto {
  club!: ClubSummary;
}

class PlayerTeamResponse {
  jerseyNumber!: number;
  startDate!: Date;
  endDate!: Date | null;
}

export class PlayerClubsResponseDto extends PlayerTeamResponse {
  club!: ClubSummary;
}

export class PlayerNationalTeamResponseDto extends PlayerTeamResponse {
  id!: number;
  nationalTeam!: NationalTeamSummary;
}
