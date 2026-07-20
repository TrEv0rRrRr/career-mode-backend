export class TeamEntity {
  id!: number;
  name!: string;
  shortName!: string;
  country!: string;
  logo?: string;
  foundationDate!: Date;
  primaryColor!: string;
  secondaryColor!: string;
  stadiumId!: number;
  managerId!: number;
  leagueId!: number;
}
