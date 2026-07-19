import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './seedDatabase.ts';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl)
  throw new Error('DATABASE_URL is required to initialize the Client.');

const adapter = new PrismaMariaDb(dbUrl);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.$connect();

  await seedDatabase(prisma);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
