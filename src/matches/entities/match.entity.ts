import { MatchFinishType, MatchStatus, MatchType } from '@prisma/client';

export class MatchEntity {
  id!: number;
  date!: Date;
  homeGoals!: number;
  awayGoals!: number;
  status!: MatchStatus;
  stadiumId!: number;
  matchDay?: number;
  homeTeamId!: number;
  awayTeamId!: number;
  homePenaltyGoals?: number;
  awayPenaltyGoals?: number;
  competitionEditionId!: number;
  type!: MatchType;
  finishType?: MatchFinishType;
}
