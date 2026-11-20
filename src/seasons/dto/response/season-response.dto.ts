import { Confederation, TransferType } from '@prisma/client';
import { CompetitionResponse } from '../../../competitions/dto/response/competition-response.dto.ts';
import { TeamResponse } from '../../../teams/dto/response/team-response.dto.ts';
/**
 * Make all properties in T optional, but now seriously. Similar to Partial<>
 */
export type Optional<T> = {
  [P in keyof T]: T[P] | null | undefined;
};

type PlayerTransferResponseDto = {
  id: number;
  name: string;
  nationality: string;
  face: string | null;
};

export type TransfersResponse = {
  id: number;
  fee: number;
  date: Date;
  type: TransferType;
  player: PlayerTransferResponseDto;
  fromTeam: Optional<TeamResponse>;
  toTeam: Optional<TeamResponse>;
};

export type TSS = {
  team: {
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
  seasonId: number;
  teamId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

export class TeamSeasonStatsResponse {
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  team!: TeamResponse;
}

export type CompetitionEditionsResponse = {
  id: number;
  competition: CompetitionResponse;
  winnerTeam: Optional<TeamResponse>;
};

export class SeasonResponseDto {
  id!: number;
  code!: string;
  notes!: string | null;
  startDate!: Date;
  endDate!: Date;
  careerId!: number;
  transfers!: TransfersResponse[];
  teamSeasonStats!: TeamSeasonStatsResponse[];
  competitionEditions!: CompetitionEditionsResponse[];
}
