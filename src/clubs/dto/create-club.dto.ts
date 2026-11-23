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

export class CreateClubDto {
  @ApiProperty({
    example: 'FC Barcelona',
    description: 'The name of the club',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'FCB',
    description: "The initials of the club's name",
  })
  @IsNotEmpty()
  @IsString()
  shortName!: string;

  @ApiProperty({
    example: 'Spain',
    description: 'The country were the club was founded',
  })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({
    enum: Confederation,
    example: Confederation.UEFA,
    description: 'The confederation the club belongs to',
  })
  @IsNotEmpty()
  @IsEnum(Confederation)
  confederation!: Confederation;

  @ApiProperty({
    example: '/images/clubs/fc-barcelona.png',
    description: "The club's logo",
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    example: '1899-11-29',
    description: 'The date when the club was founded',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  foundationDate!: Date;

  @ApiProperty({
    example: '#14285d',
    description: "The main color of the club's jersey",
  })
  @IsNotEmpty()
  @IsString()
  primaryColor!: string;

  @ApiProperty({
    example: '#8c0035',
    description: "The secondary color of the club's jersey",
  })
  @IsNotEmpty()
  @IsString()
  secondaryColor!: string;

  @ApiProperty({
    example: 1,
    description: 'The foreign key that connects the club to its stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  stadiumId!: number;

  @ApiProperty({
    example: 2,
    description:
      'The foreign key that connects the club to the league where it plays',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  leagueId!: number;
}
