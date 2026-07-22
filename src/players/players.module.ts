import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { PlayersController } from './players.controller.ts';
import { PlayersRepository } from './players.repository.ts';
import { PlayersService } from './players.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository, TeamsService, TeamsRepository],
})
export class PlayersModule {}
