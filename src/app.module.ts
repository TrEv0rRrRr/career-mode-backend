import { Module } from '@nestjs/common';
import { CompetitionsModule } from './competitions/competitions.module.ts';
import { PrismaModule } from './prisma/prisma.module.ts';
import { PrismaService } from './prisma/prisma.service.ts';

@Module({
  imports: [PrismaModule, CompetitionsModule],
  providers: [PrismaService],
})
export class AppModule {}
