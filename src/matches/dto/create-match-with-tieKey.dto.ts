import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateMatchDto } from './create-match.dto.ts';

export class CreateMatchWithTieKeyDto extends CreateMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tieKey?: string;
}
