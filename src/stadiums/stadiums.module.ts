import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { StadiumsController } from './stadiums.controller.ts';
import { StadiumsRepository } from './stadiums.repository.ts';
import { StadiumsService } from './stadiums.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [StadiumsController],
  providers: [StadiumsService, StadiumsRepository],
  exports: [StadiumsService],
})
export class StadiumsModule {}
