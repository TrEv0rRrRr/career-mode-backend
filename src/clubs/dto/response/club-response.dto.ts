import { Confederation, Player, PreferredFoot } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { ManagerSummary } from '../../../managers/dto/response/manager-response.dto.ts';

export type PlayerType = {
  id: number;
  name: string;
  overall: number;
  nationality: string;
  face: string | null;
};

export type ClubSeasonStatsType = {
  season: {
    id: number;
    startDate: Date;
    endDate: Date;
    code: string;
    notes: string | null;
    careerId: number;
  };
} & {
  clubId: number;
  seasonId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

export type ClubPlayerSquadType = {
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
  clubId: number;
  seasonId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: Decimal;
};

export type PlayerClubType = {
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
  clubId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
};

export type ManagerClubType = {
  manager: {
    id: number;
    name: string;
    birthDate: Date;
    nationality: string;
    face: string | null;
  };
} & {
  id: number;
  managerId: number;
  startDate: Date;
  endDate: Date | null;
  clubId: number;
};

export class ClubResponseDto {
  id!: number;
  name!: string;
  logo!: string | null;
  country!: string;
  confederation!: Confederation;
  manager!: string | null;
  stadium!: string;
  league!: string;
}

export type ClubSummary = Omit<
  ClubResponseDto,
  'manager' | 'stadium' | 'league'
>;

export class ClubPlayersResponseDto {
  id!: number;
  jerseyNumber!: number;
  startDate!: Date;
  endDate!: Date | null;
  player!: Player;
}

export class ClubSquadStatsResponseDto {
  matches!: number;
  goals!: number;
  assists!: number;
  yellowCards!: number;
  readCards!: number;
  rating!: number;
  player!: PlayerType;
}

export class ClubSeasonStatsResponseDto {
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  season!: string;
}

export class CurrentManagerClubResponseDto {
  id!: number;
  clubId!: number;
  startDate!: Date;
  endDate!: Date | null;
  manager!: ManagerSummary;
}
