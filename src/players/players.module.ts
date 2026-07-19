import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { PlayersController } from './players.controller.ts';
import { PlayersRepository } from './players.repository.ts';
import { PlayersService } from './players.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
