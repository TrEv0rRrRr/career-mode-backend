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
      { homeTeamId: 1, awayTeamId: 2 },
      { homeTeamId: 3, awayTeamId: 4 },
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
  homeTeamId!: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  awayTeamId!: number;
}
