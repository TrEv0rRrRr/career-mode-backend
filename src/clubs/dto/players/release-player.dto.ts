import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class ReleasePlayerDto {
  @ApiProperty({
    example: '2027-06-30',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
