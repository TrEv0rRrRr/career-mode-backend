import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateKnockoutRoundPairingsDto {
  @ApiProperty({
    example: [
      { homeClubId: 1, awayClubId: 2 },
      { homeClubId: 3, awayClubId: 4 },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePairingDto)
  pairings!: CreatePairingDto[];
}

export class CreatePairingDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  homeClubId!: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  awayClubId!: number;
}
