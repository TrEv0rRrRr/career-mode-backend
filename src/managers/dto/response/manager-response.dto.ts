import { Confederation } from '@prisma/client';
import { NationalTeamResponse } from '../../../matches/dto/response/match-response.dto.ts';
import { TeamResponse } from '../../../teams/dto/response/team-response.dto.ts';

export type ManagerTeamType = {
  manager: {
    name: string;
    id: number;
    birthDate: Date;
    nationality: string;
    face: string | null;
  };
  team: {
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
  teamId: number;
  startDate: Date;
  endDate: Date | null;
};

export type ManagerNationalTeamType = {
  manager: {
    name: string;
    id: number;
    birthDate: Date;
    nationality: string;
    face: string | null;
  };
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

export class ManagerTeamResponseDto {
  id!: number;
  startDate!: Date;
  endDate!: Date | null;
  team!: Omit<TeamResponse, 'confederation'>;
}

export class ManagerNationalTeamResponseDto {
  id!: number;
  startDate!: Date;
  endDate!: Date | null;
  nationalTeam!: Omit<NationalTeamResponse, 'confederation'>;
}
