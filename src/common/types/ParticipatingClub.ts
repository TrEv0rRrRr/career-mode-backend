import { Club } from '@prisma/client';

export type ParticipatingClub = {
  club: Pick<Club, 'id' | 'stadiumId'>;
  position: number | null;
};
