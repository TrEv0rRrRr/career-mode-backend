import { Module } from '@nestjs/common';
import { NationalTeamsModule } from '../national-teams/national-teams.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { PlayersController } from './players.controller.ts';
import { PlayersRepository } from './players.repository.ts';
import { PlayersService } from './players.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule, SeasonsModule, NationalTeamsModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
  exports: [PlayersService],
})
export class PlayersModule {}
