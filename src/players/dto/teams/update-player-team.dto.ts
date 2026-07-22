import { PartialType } from '@nestjs/swagger';
import { AssignTeamDto } from './assign-team.dto.ts';

export class UpdatePlayerTeamDto extends PartialType(AssignTeamDto) {}
