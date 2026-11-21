import { Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module.ts';
import { PlayersModule } from '../players/players.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { NationalTeamsController } from './national-teams.controller.ts';
import { NationalTeamsRepository } from './national-teams.repository.ts';
import { NationalTeamsService } from './national-teams.service.ts';

@Module({
  imports: [PrismaModule, PlayersModule, ManagersModule],
  controllers: [NationalTeamsController],
  providers: [NationalTeamsService, NationalTeamsRepository],
  exports: [NationalTeamsService],
})
export class NationalTeamsModule {}
