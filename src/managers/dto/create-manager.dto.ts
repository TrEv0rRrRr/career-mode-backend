import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({
    example: 'Hansi Flick',
    description: 'The name of the manager',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: '1965-06-02',
    description: 'The birthdate of the manager',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  birthDate!: Date;

  @ApiProperty({
    example: 'Germany',
    description: 'The nationality of the manger',
  })
  @IsNotEmpty()
  @IsString()
  nationality!: string;

  @ApiProperty({
    example: '/images/managers/hansi-flick.png',
    description: "The manager's face image",
  })
  @IsOptional()
  @IsString()
  face?: string;
}
