import { ClubSummary } from '../../../clubs/dto/response/club-response.dto.ts';
import { NationalTeamSummary } from '../../../national-teams/dto/response/national-team-response.dto.ts';

export class StadiumResponseDto {
  id!: number;
  name!: string;
  country!: string;
  image!: string | null;
  capacity!: number;
  openingDate!: Date;
  homeClub?: ClubSummary;
  homeNationalTeam?: NationalTeamSummary;
}

export type StadiumSummary = Omit<
  StadiumResponseDto,
  'capacity' | 'openingDate' | 'homeClub' | 'homeNationalTeam'
>;
