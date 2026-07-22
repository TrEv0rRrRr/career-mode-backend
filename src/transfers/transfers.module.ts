import { Module } from '@nestjs/common';
import { PlayersModule } from '../players/players.module.ts';
import { PlayersRepository } from '../players/players.repository.ts';
import { PlayersService } from '../players/players.service.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { SeasonsRepository } from '../seasons/seasons.repository.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsModule } from '../teams/teams.module.ts';
import { TeamsRepository } from '../teams/teams.repository.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { TransfersController } from './transfers.controller.ts';
import { TransfersRepository } from './transfers.repository.ts';
import { TransfersService } from './transfers.service.ts';

@Module({
  imports: [PrismaModule, PlayersModule, TeamsModule, SeasonsModule],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    TransfersRepository,
    PlayersService,
    PlayersRepository,
    TeamsService,
    TeamsRepository,
    SeasonsService,
    SeasonsRepository,
  ],
})
export class TransfersModule {}
