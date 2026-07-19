import { Module } from '@nestjs/common';
import { CompetitionsModule } from './competitions/competitions.module.ts';
import { PlayersModule } from './players/players.module.ts';
import { PrismaModule } from './prisma/prisma.module.ts';
import { PrismaService } from './prisma/prisma.service.ts';

@Module({
  imports: [PrismaModule, CompetitionsModule, PlayersModule],
  providers: [PrismaService],
})
export class AppModule {}
