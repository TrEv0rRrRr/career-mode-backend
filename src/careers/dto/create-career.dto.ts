import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
      'The foreign key that connects my career with the club I coached',
  })
  @IsNotEmpty()
  @IsInt()
  clubId!: number;
}
