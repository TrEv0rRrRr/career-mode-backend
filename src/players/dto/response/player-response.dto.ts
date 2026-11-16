import { PreferredFoot } from '@prisma/client';
import { TeamResponse } from '../../../common/types/TeamResponse.ts';

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

export type PlayerTeams = {
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
    managerId: number;
    leagueId: number;
  };
} & {
  id: number;
  playerId: number;
  teamId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
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

export class PlayerTeamsResponseDto {
  teamId!: number;
  jerseyNumber!: number;
  startDate!: Date;
  endDate!: Date | null;
  team!: TeamResponse;
}
