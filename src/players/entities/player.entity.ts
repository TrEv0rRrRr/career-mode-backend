import { PreferredFoot } from '@prisma/client';

export class PlayerEntity {
  name!: string;
  birthDate!: Date;
  nationality!: string;
  preferredFoot!: PreferredFoot;
  overall!: number;
  height!: number;
  weight!: number;
  face?: string;
}
