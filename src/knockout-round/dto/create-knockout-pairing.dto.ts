import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateKnockoutRoundPairingsDto {
  @ApiProperty({
    example: [
      { homeClubId: 1, awayClubId: 2 },
      { homeClubId: 3, awayClubId: 4 },
    ],
    examples: [
      {
        pairings: [
          { homeClubId: 1, awayClubId: 2 },
          { homeClubId: 3, awayClubId: 4 },
        ],
      },
      {
        pairings: [
          { homeNationalTeamId: 1, awayNationalTeamId: 2 },
          { homeNationalTeamId: 3, awayNationalTeamId: 4 },
        ],
      },
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
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  homeClubId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  awayClubId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  homeNationalTeamId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  awayNationalTeamId?: number;
}
