import { $Enums } from '@prisma/client';

export type EditionType = {
  competition: {
    name: string;
    id: number;
    type: $Enums.CompetitionType;
    format: $Enums.CompetitionFormat;
    logo: string | null;
    hasThirdPlaceMatch: boolean;
    maxTeamsNumber: number;
    hasTwoLeggedKnockout: boolean;
    groups: number | null;
    teamsPerGroup: number | null;
  };
} | null;
