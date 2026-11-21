import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class FireManagerDto {
  @ApiProperty({
    description:
      'The date when the manager contract finished or when the manager got sacked.',
    example: '2027-06-30',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
