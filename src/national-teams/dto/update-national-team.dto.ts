import { PartialType } from '@nestjs/swagger';
import { CreateNationalTeamDto } from './create-national-team.dto.ts';

export class UpdateNationalTeamDto extends PartialType(CreateNationalTeamDto) {}
