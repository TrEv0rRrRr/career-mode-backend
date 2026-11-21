import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class FireAndHireManagerDto {
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
      'The date when the manager contract finished or when the manager got sacked.',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  endDate!: Date;
}
