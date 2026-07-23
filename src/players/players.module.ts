import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { SeasonsRepository } from '../seasons/seasons.repository.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { PlayersController } from './players.controller.ts';
import { PlayersRepository } from './players.repository.ts';
import { PlayersService } from './players.service.ts';

@Module({
  imports: [PrismaModule, TeamsModule, SeasonsModule],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    PlayersRepository,
    TeamsService,
    TeamsRepository,
    SeasonsService,
    SeasonsRepository,
  ],
})
export class PlayersModule {}
