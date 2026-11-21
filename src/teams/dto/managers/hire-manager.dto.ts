import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class HireManagerDto {
  @ApiProperty({
    example: '2026-07-21',
    description: 'The date when the manager was hired',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  startDate!: Date;

  @ApiProperty({
    example: '2030-07-21',
    description:
      "The date when the manager contract finished or when the manager got sacked. Can be null, which means that he's currently managing the team.",
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
