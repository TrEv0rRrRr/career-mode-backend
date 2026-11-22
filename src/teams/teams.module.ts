import { Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module.ts';
import { PlayersModule } from '../players/players.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TransfersModule } from '../transfers/transfers.module.ts';
import { TeamsController } from './teams.controller.ts';
import { TeamsRepository } from './teams.repository.ts';
import { TeamsService } from './teams.service.ts';

@Module({
  imports: [
    PrismaModule,
    PlayersModule,
    SeasonsModule,
    ManagersModule,
    TransfersModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
