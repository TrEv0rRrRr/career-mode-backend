import { Confederation } from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { NationalTeamResponse } from '../../../matches/dto/response/match-response.dto.ts';

export type ManagerClubType = {
  club: {
    name: string;
    id: number;
    confederation: Confederation;
    logo: string | null;
    country: string;
    shortName: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
    leagueId: number;
  };
} & {
  id: number;
  managerId: number;
  clubId: number;
  startDate: Date;
  endDate: Date | null;
};

export type ManagerNationalTeamType = {
  nationalTeam: {
    name: string;
    id: number;
    confederation: Confederation;
    logo: string | null;
    shortName: string;
    foundationDate: Date;
    primaryColor: string;
    secondaryColor: string;
    stadiumId: number;
  };
} & {
  id: number;
  managerId: number;
  startDate: Date;
  endDate: Date | null;
  nationalTeamId: number;
};

export class ManagerClubResponseDto {
  id!: number;
  startDate!: Date;
  endDate!: Date | null;
  club!: Omit<ClubSummary, 'confederation'>;
}

export class ManagerNationalTeamResponseDto {
  id!: number;
  startDate!: Date;
  endDate!: Date | null;
  nationalTeam!: Omit<NationalTeamResponse, 'confederation'>;
}
