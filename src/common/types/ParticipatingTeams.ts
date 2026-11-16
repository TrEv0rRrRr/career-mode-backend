import { Team } from '@prisma/client';

export type ParticipatingTeam = {
  team: Pick<Team, 'id' | 'stadiumId'>;
  position: number | null;
};
