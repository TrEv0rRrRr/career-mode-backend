import { PrismaClient } from '@prisma/client';
import { barcelonaPlayers } from './data/barcelonaPlayers.js';
import { competitions } from './data/competitions.js';
import { managers } from './data/managers.js';
import { positions } from './data/positions.js';
import { stadiums } from './data/stadiums.js';
import { teams } from './data/teams.js';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.player.createMany({ data: barcelonaPlayers, skipDuplicates: true }),
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
