import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { ManagersController } from './managers.controller.ts';
import { ManagersRepository } from './managers.repository.ts';
import { ManagersService } from './managers.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [ManagersController],
  providers: [ManagersService, ManagersRepository],
  exports: [ManagersService],
})
export class ManagersModule {}
