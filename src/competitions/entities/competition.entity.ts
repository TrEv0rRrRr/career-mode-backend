import { CompetitionType } from '@prisma/client';

export class CompetitionEntity {
  id!: number;
  name!: string;
  type!: CompetitionType;
  logo?: string;
}
