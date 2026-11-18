import { Player, PreferredFoot } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export class TeamResponse {
  id!: number;
  name!: string;
  logo!: string | null;
  country!: string;
}

export type PlayerType = {
  id: number;
  name: string;
  overall: number;
  nationality: string;
  face: string | null;
};

export type TeamSeasonStatsType = {
  season: {
    id: number;
    startDate: Date;
    endDate: Date;
    code: string;
    notes: string | null;
    careerId: number;
  };
} & {
  teamId: number;
  seasonId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

export type TeamPlayerSquadType = {
  player: {
    id: number;
    name: string;
    birthDate: Date;
    nationality: string;
    face: string | null;
    preferredFoot: PreferredFoot;
    overall: number;
    height: Decimal;
    weight: number;
  };
} & {
  matches: number;
  playerId: number;
  teamId: number;
  seasonId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: Decimal;
};

export type PlayerTeamType = {
  player: {
    name: string;
    id: number;
    birthDate: Date;
    nationality: string;
    face: string | null;
    preferredFoot: PreferredFoot;
    overall: number;
    height: Decimal;
    weight: number;
  };
} & {
  id: number;
  playerId: number;
  teamId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
};

export class TeamResponseDto extends TeamResponse {
  manager!: string | null;
  stadium!: string;
  league!: string;
}

export class TeamPlayersResponseDto {
  jerseyNumber!: number;
  startDate!: Date;
  endDate!: Date | null;
  player!: Player;
}

export class TeamSquadStatsResponseDto {
  matches!: number;
  goals!: number;
  assists!: number;
  yellowCards!: number;
  readCards!: number;
  rating!: number;
  player!: PlayerType;
}

export class TeamSeasonStatsResponseDto {
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  season!: string;
}
