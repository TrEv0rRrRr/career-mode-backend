import { Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module.ts';
import { PlayersModule } from '../players/players.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TransfersModule } from '../transfers/transfers.module.ts';
import { ClubsController } from './clubs.controller.ts';
import { ClubsRepository } from './clubs.repository.ts';
import { ClubsService } from './clubs.service.ts';

@Module({
  imports: [
    PrismaModule,
    PlayersModule,
    SeasonsModule,
    ManagersModule,
    TransfersModule,
  ],
  controllers: [ClubsController],
  providers: [ClubsService, ClubsRepository],
  exports: [ClubsService],
})
export class ClubsModule {}
