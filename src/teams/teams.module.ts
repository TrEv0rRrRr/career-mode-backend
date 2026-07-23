import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { SeasonsRepository } from '../seasons/seasons.repository.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsController } from './teams.controller.ts';
import { TeamsRepository } from './teams.repository.ts';
import { TeamsService } from './teams.service.ts';

@Module({
  imports: [PrismaModule, SeasonsModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository, SeasonsService, SeasonsRepository],
})
export class TeamsModule {}
