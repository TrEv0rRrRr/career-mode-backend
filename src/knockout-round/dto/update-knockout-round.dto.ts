import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateKnockoutRoundDto {
  @ApiProperty({
    example: false,
    description: 'Represents whether the round is completed or not.',
  })
  @IsNotEmpty()
  @IsBoolean()
  completed!: boolean;
}
