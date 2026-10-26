import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl)
      throw new Error('DATABASE_URL is required to initialize the Client.');

    const parsedDbUrl = new URL(dbUrl);

    super({
      adapter: new PrismaMariaDb({
        host: parsedDbUrl.hostname,
        port: Number(parsedDbUrl.port) || 3306,
        user: decodeURIComponent(parsedDbUrl.username),
        password: decodeURIComponent(parsedDbUrl.password),
        database: parsedDbUrl.pathname.slice(1),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
