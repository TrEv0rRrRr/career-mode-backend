export type ParticipatingTeam = {
  team: {
    name: string;
    id: number;
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
  position: number | null;
};
