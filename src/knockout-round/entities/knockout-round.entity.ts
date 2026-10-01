import { MatchType } from '@prisma/client';

export class KnockoutRound {
  id!: number;
  competitionEditionId!: number;
  type!: MatchType;
  completed!: boolean;
}
