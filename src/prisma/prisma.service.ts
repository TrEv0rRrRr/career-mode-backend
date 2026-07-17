import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl)
      throw new Error('DATABASE_URL is required to initialize the Client.');

    // super({
    //   adapter: new PrismaMariaDb(dbUrl),
    // });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
