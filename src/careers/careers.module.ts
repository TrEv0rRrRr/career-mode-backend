import { Module } from '@nestjs/common';
import { ClubsModule } from '../clubs/clubs.module.ts';
import { PrismaModule } from '../prisma/prisma.module.ts';
import { CareersController } from './careers.controller.ts';
import { CareersRepository } from './careers.repository.ts';
import { CareersService } from './careers.service.ts';

@Module({
  imports: [PrismaModule, ClubsModule],
  controllers: [CareersController],
  providers: [CareersService, CareersRepository],
  exports: [CareersService],
})
export class CareerModule {}
