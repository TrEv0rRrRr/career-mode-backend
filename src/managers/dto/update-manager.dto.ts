import { PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto.ts';

export class UpdateManagerDto extends PartialType(CreateManagerDto) {}
