import { Module } from '@nestjs/common';
import { CompetitionsModule } from './competitions/competitions.module.ts';
import { PlayersModule } from './players/players.module.ts';
import { PrismaModule } from './prisma/prisma.module.ts';
import { PrismaService } from './prisma/prisma.service.ts';
import { ManagersModule } from './managers/managers.module';

@Module({
  imports: [PrismaModule, CompetitionsModule, PlayersModule, ManagersModule],
  providers: [PrismaService],
})
export class AppModule {}
