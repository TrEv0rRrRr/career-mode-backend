import {
  Confederation,
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { TeamResponse } from '../../../teams/dto/response/team-response.dto.ts';

export class NationalTeamResponse {
  id!: number;
  name!: string;
  logo!: string | null;
  confederation!: Confederation;
}

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
  homeTeamId!: number | null;
  awayTeamId!: number | null;
  winnerTeamId!: number | null;
  homeNationalTeamId!: number | null;
  awayNationalTeamId!: number | null;
  winnerNationalTeamId!: number | null;
  competitionEditionId!: number;
  homeTeam!: TeamResponse | null;
  awayTeam!: TeamResponse | null;
  homeNationalTeam!: NationalTeamResponse | null;
  awayNationalTeam!: NationalTeamResponse | null;
  type!: MatchType;
  finishType!: MatchFinishType | null;
}

export class MatchesWithTieResponseDto {
  tieId!: number;
  knockoutRoundId!: number;
  matches!: MatchResponseDto[];
}
