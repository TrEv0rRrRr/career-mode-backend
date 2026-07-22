import { ApiProperty } from '@nestjs/swagger';
import { PreferredFoot } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({
    example: 'Lamine Yamal',
    description: 'The name of the player',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '2007-05-01',
    description: 'The birthdate of the player',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @ApiProperty({
    example: 'Spain',
    description: 'The nationality of the player',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nationality!: string;

  @ApiProperty({
    example: PreferredFoot.LEFT,
    enum: PreferredFoot,
    description: "The player's main foot",
  })
  @IsNotEmpty()
  @IsEnum(PreferredFoot)
  preferredFoot!: PreferredFoot;

  @ApiProperty({
    example: 86,
    description: "The player's overall",
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(106)
  overall!: number;

  @ApiProperty({
    example: 1.85,
    description: "The player's height",
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1.5)
  @Max(2.5)
  height!: number;

  @ApiProperty({
    example: 70,
    description: "The player's weight",
  })
  @IsNotEmpty()
  @IsInt()
  @Min(40)
  @Max(150)
  weight!: number;

  @ApiProperty({
    example: 'images/players/lamine-yamal.png',
    description: "The player's face image",
  })
  @IsOptional()
  @IsString()
  face?: string;
}
