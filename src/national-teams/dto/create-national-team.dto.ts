import { ApiProperty } from '@nestjs/swagger';
import { Confederation } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateNationalTeamDto {
  @ApiProperty({
    example: 'Perú',
    description: 'The name of the national team',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'PER',
    description: "The initials of the nt's name",
  })
  @IsNotEmpty()
  @IsString()
  shortName!: string;

  @ApiProperty({
    enum: Confederation,
    example: Confederation.CONMEBOL,
    description: 'The confederation the nt belongs to',
  })
  @IsNotEmpty()
  @IsEnum(Confederation)
  confederation!: Confederation;

  @ApiProperty({
    example: '/images/teams/peru.png',
    description: "The nt's logo",
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    example: '1922-08-23',
    description: 'The date when the nt was founded',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  foundationDate!: Date;

  @ApiProperty({
    example: '#D91023',
    description: "The main color of the nt's jersey",
  })
  @IsNotEmpty()
  @IsString()
  primaryColor!: string;

  @ApiProperty({
    example: '#ffffff',
    description: "The secondary color of the nt's jersey",
  })
  @IsNotEmpty()
  @IsString()
  secondaryColor!: string;

  @ApiProperty({
    example: 1,
    description: 'The foreign key that connects the nt to its stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  stadiumId!: number;
}
