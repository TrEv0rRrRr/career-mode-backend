import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { PlayersController } from './players.controller.ts';
import { PlayersRepository } from './players.repository.ts';
import { PlayersService } from './players.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule, SeasonsModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
  exports: [PlayersService],
})
export class PlayersModule {}
