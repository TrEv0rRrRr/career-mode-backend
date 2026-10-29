import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateMatchDto } from './create-match.dto.ts';

export class CreateMatchWithTieKeyDto extends CreateMatchDto {
  @ApiProperty({
    example: 'pokal-1',
    description:
      'This is a temporary key that the backend uses to determine which brackets to pair and create ties.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tieKey?: string;
}
