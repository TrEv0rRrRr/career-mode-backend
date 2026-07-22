import { IsDateString, IsNotEmpty } from 'class-validator';

export class PlayerTeamQueryDto {
  @IsNotEmpty()
  @IsDateString()
  startDate!: string;
}
