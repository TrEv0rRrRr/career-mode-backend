import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class DismissPlayerDto {
  @ApiProperty({
    description: 'The date when the player got dismissed',
    example: '2027-06-30',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
