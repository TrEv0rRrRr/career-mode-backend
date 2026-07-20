import { PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto.ts';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
