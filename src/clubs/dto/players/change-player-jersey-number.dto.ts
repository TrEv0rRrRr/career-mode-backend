import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class ChangePlayerJerseyNumberDto {
  @ApiProperty({
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(999)
  jerseyNumber!: number;
}
