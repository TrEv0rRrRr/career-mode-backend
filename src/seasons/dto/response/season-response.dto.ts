import { Confederation, TransferType } from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { CompetitionSummary } from '../../../competitions/dto/response/competition-response.dto.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';
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
  fromClub: Optional<ClubSummary>;
  toClub: Optional<ClubSummary>;
};

export type TSS = {
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
  seasonId: number;
  clubId: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

export class ClubSeasonStatsResponse {
  played!: number;
  wins!: number;
  draws!: number;
  losses!: number;
  gf!: number;
  ga!: number;
  gd!: number;
  club!: ClubSummary;
}

export type CompetitionEditionsResponse = {
  id: number;
  competition: CompetitionSummary;
  winnerClub: Optional<ClubSummary>;
  winnerNationalTeam: Optional<NationalTeamSummary>;
};

export class SeasonResponseDto {
  id!: number;
  code!: string;
  notes!: string | null;
  startDate!: Date;
  endDate!: Date;
  careerId!: number;
  transfers!: TransfersResponse[];
  clubSeasonStats!: ClubSeasonStatsResponse[];
  competitionEditions!: CompetitionEditionsResponse[];
}
