import { Confederation } from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';

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

export class ManagerResponseDto {
  id!: number;
  name!: string;
  face!: string | null;
  nationality!: string;
  birthDate!: Date;
  currentClub!: Omit<ManagerClubResponseDto, 'id'> | null;
  currentNationalTeam!: Omit<ManagerNationalTeamResponseDto, 'id'> | null;
}

export type ManagerSummary = Omit<
  ManagerResponseDto,
  'birthDate' | 'currentClub' | 'currentNationalTeam'
>;

class ManagerTeam {
  id!: number;
  startDate!: Date;
  endDate!: Date | null;
}

export class ManagerClubResponseDto extends ManagerTeam {
  club!: Omit<ClubSummary, 'confederation'>;
}

export class ManagerNationalTeamResponseDto extends ManagerTeam {
  nationalTeam!: Omit<NationalTeamSummary, 'confederation'>;
}
