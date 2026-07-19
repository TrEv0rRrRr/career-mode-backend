import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateStadiumDto {
  @ApiProperty({
    example: 'Spotify Camp Nou',
    description: 'The name of the stadium',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Spain',
    description: 'The country where the stadium is located',
  })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({
    example: '/images/stadiums/spotify-camp-nou.png',
    description: 'The image of the stadium',
  })
  @IsString()
  image?: string;

  @ApiProperty({
    example: 105000,
    description: 'The maximum capacity of the stadium',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1000)
  @Max(115000)
  capacity!: number;

  @ApiProperty({
    example: '1957-09-24',
    description: 'The date when the stadium was opened for the first time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  openingDate!: Date;
}
