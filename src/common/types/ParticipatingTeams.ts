import { Team } from '@prisma/client';

export type ParticipatingTeam = {
  team: Team;
  position: number | null;
};
