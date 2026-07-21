import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePlayerPositionDto {
  @ApiProperty({
    example: false,
    default: false,
    description: "Is this position the player's main position?",
  })
  @IsNotEmpty()
  @IsBoolean()
  isPrimary!: boolean;
}
