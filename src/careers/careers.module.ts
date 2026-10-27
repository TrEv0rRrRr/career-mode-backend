import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { CareersController } from './careers.controller.ts';
import { CareersRepository } from './careers.repository.ts';
import { CareersService } from './careers.service.ts';

@Module({
  imports: [PrismaModule],
  controllers: [CareersController],
  providers: [CareersService, CareersRepository],
  exports: [CareersService],
})
export class CareerModule {}
