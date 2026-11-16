import {
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { TeamResponse } from '../../../common/types/TeamResponse.ts';

interface Stadium {
  id: number;
  name: string;
  capacity: number;
}
export class MatchResponseDto {
  id!: number;
  date!: Date;
  homeGoals!: number;
  awayGoals!: number;
  status!: MatchStatus;
  stadium!: Stadium;
  matchday!: number | null;
  homePenaltyGoals!: number | null;
  awayPenaltyGoals!: number | null;
  leg!: MatchLeg | null;
  tieId!: number | null;
  winnerTeamId!: number | null;
  competitionEditionId!: number;
  homeTeam!: TeamResponse;
  awayTeam!: TeamResponse;
  type!: MatchType;
  finishType!: MatchFinishType | null;
}

export class MatchesWithTieResponseDto {
  tieId!: number;
  knockoutRoundId!: number;
  matches!: MatchResponseDto[];
}
