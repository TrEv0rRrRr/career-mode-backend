import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { PositionsController } from './positions.controller.ts';
import { PositionsRepository } from './positions.repository.ts';
import { PositionsService } from './positions.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [PositionsController],
  providers: [PositionsService, PositionsRepository],
})
export class PositionsModule {}
