import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

export class AssignPositionsDto {
  @ApiProperty({
    example: 1,
    description: "The position's id",
  })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({
    example: false,
    default: false,
    description: "Is this position the player's main position?",
  })
  @IsNotEmpty()
  @IsBoolean()
  isPrimary!: boolean;
}
