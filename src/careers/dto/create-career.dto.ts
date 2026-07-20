import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCareerDto {
  @ApiProperty({
    example: 'Trevor',
    description: "My manager's name",
  })
  @IsNotEmpty()
  @IsString()
  managerName!: string;

  @ApiProperty({
    example: 1,
    description:
      'The foreign key that connects my career with the team I coached',
  })
  @IsNotEmpty()
  @IsInt()
  teamId!: number;

  @ApiProperty({
    example: '2026-07-20',
    description: 'The date when my master league started',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({
    example: '2026-12-20',
    description: 'The date when my master league ended',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
