import { PrismaClient } from '@prisma/client';
import { clubs } from './data/clubs.ts';
import { competitions } from './data/competitions.ts';
import { managerClubs } from './data/managerClubs.ts';
import { managerNationalTeams } from './data/managerNationalTeams.ts';
import { managers } from './data/managers.ts';
import { nationalTeams } from './data/nationalTeams.ts';
import { playerClubs } from './data/playerClubs.ts';
import { playerPositions } from './data/playerPositions.ts';
import { barcelona } from './data/players/barcelona.ts';
import { positions } from './data/positions.ts';
import { stadiums } from './data/stadiums.ts';

export const seedDatabase = async (prisma: PrismaClient) => {
  await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.player.createMany({ data: barcelona, skipDuplicates: true }),
      tx.competition.createMany({ data: competitions, skipDuplicates: true }),
      tx.manager.createMany({ data: managers, skipDuplicates: true }),
      tx.position.createMany({ data: positions, skipDuplicates: true }),
      tx.stadium.createMany({ data: stadiums, skipDuplicates: true }),
      tx.playerPosition.createMany({
        data: playerPositions,
        skipDuplicates: true,
      }),
    ]);

    await tx.club.createMany({
      data: clubs,
      skipDuplicates: true,
    });

    await tx.nationalTeam.createMany({
      data: nationalTeams,
      skipDuplicates: true,
    });

    await tx.playerClub.createMany({
      data: playerClubs,
      skipDuplicates: true,
    });

    await tx.managerClub.createMany({
      data: managerClubs,
      skipDuplicates: true,
    });

    await tx.managerNationalTeam.createMany({
      data: managerNationalTeams,
      skipDuplicates: true,
    });
  });
};
