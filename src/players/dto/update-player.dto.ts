import { PartialType } from '@nestjs/swagger';
import { CreatePlayerDto } from './create-player.dto.ts';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
