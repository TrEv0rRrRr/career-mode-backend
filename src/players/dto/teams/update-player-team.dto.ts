import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePlayerTeamDto {
  @ApiProperty({
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber?: number;

  @ApiProperty({
    example: '2027-06-30',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
