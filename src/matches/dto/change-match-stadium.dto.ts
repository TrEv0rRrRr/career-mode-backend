import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ChangeMatchStadiumDTO {
  @ApiProperty({
    example: 1,
    description: 'The id of the stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  stadiumId!: number;
}
