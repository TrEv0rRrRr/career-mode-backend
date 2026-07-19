import { PrismaClient } from '@prisma/client';
import { competitions } from './data/competitions.ts';
import { managers } from './data/managers.ts';
import { barcelona } from './data/players/barcelona.ts';
import { positions } from './data/positions.ts';
import { stadiums } from './data/stadiums.ts';
import { teams } from './data/teams.ts';

export const seedDatabase = async (prisma: PrismaClient) => {
  await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.player.createMany({ data: barcelona, skipDuplicates: true }),
      tx.competition.createMany({ data: competitions, skipDuplicates: true }),
      tx.manager.createMany({ data: managers, skipDuplicates: true }),
      tx.position.createMany({ data: positions, skipDuplicates: true }),
      tx.stadium.createMany({ data: stadiums, skipDuplicates: true }),
    ]);

    await tx.team.createMany({
      data: teams,
      skipDuplicates: true,
    });
  });
};
