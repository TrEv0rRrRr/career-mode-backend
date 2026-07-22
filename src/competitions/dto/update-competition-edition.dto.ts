import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCompetitionEditionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  winnerTeamId!: number;
}
