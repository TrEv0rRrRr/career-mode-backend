import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto.ts';

export class UpdateClubDto extends PartialType(CreateClubDto) {}
