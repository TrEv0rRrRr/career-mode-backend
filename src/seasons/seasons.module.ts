import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { SeasonsController } from './seasons.controller.ts';
import { SeasonsRepository } from './seasons.repository.ts';
import { SeasonsService } from './seasons.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [SeasonsController],
  providers: [SeasonsService, SeasonsRepository],
  exports: [SeasonsService],
})
export class SeasonsModule {}
