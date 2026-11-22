import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsModule } from '../seasons/seasons.module.ts';
import { TransfersController } from './transfers.controller.ts';
import { TransfersRepository } from './transfers.repository.ts';
import { TransfersService } from './transfers.service.ts';

@Module({
  imports: [PrismaModule, SeasonsModule],
  controllers: [TransfersController],
  providers: [TransfersService, TransfersRepository],
  exports: [TransfersService],
})
export class TransfersModule {}
