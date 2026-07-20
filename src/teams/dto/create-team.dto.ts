import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    example: 'FC Barcelona',
    description: 'The name of the team',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'FCB',
    description: "The initials of the team's name",
  })
  @IsNotEmpty()
  @IsString()
  shortName!: string;

  @ApiProperty({
    example: 'Spain',
    description: 'The country were the team was founded',
  })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({
    example: '/images/teams/fc-barcelona.png',
    description: "The team's logo",
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    example: '1899-11-29',
    description: 'The date when the team was founded',
  })
  @IsNotEmpty()
  @IsString()
  foundationDate!: Date;

  @ApiProperty({
    example: '#14285d',
    description: "The main color of the team's jersey",
  })
  @IsNotEmpty()
  @IsString()
  primaryColor!: string;

  @ApiProperty({
    example: '#8c0035',
    description: "The secondary color of the team's jersey",
  })
  @IsNotEmpty()
  @IsString()
  secondaryColor!: string;

  @ApiProperty({
    example: 1,
    description: 'The foreign key that connects the team to its stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  stadiumId!: number;

  @ApiProperty({
    example: 1,
    description: 'The foreign key that connects the team to its manager',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  managerId!: number;

  @ApiProperty({
    example: 2,
    description:
      'The foreign key that connects the team to the league where it plays',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  leagueId!: number;
}
