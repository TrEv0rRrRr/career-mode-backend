import { KnockoutRoundType } from '../../enums/KnockoutRoundType.ts';

export class KnockoutQualifiedTeam {
  teamId!: number;
  team!: {
    name: string;
    logo: string | null;
    country: string;
  };
}

export class KnockoutRoundResponseDto {
  id!: number;
  competitionEditionId!: number;
  type!: KnockoutRoundType;
  completed!: boolean;
  qualifiedTeams!: KnockoutQualifiedTeam[];
}
