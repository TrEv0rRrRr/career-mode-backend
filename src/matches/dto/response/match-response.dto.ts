import {
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { CompetitionSummary } from '../../../competitions/dto/response/competition-response.dto.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';
import { StadiumSummary } from '../../../stadiums/dto/response/stadiums.response.ts';

export class MatchResponseDto {
  id!: number;
  date!: Date;
  homeGoals!: number;
  awayGoals!: number;
  status!: MatchStatus;
  stadium!: StadiumSummary;
  competition!: CompetitionSummary;
  matchday!: number | null;
  homePenaltyGoals!: number | null;
  awayPenaltyGoals!: number | null;
  leg!: MatchLeg | null;
  tieId!: number | null;
  homeClubId!: number | null;
  awayClubId!: number | null;
  winnerClubId!: number | null;
  homeNationalTeamId!: number | null;
  awayNationalTeamId!: number | null;
  winnerNationalTeamId!: number | null;
  competitionEditionId!: number;
  homeClub!: ClubSummary | null;
  awayClub!: ClubSummary | null;
  homeNationalTeam!: NationalTeamSummary | null;
  awayNationalTeam!: NationalTeamSummary | null;
  type!: MatchType;
  finishType!: MatchFinishType | null;
}

export class MatchesWithTieResponseDto {
  tieId!: number;
  knockoutRoundId!: number;
  matches!: MatchResponseDto[];
}
