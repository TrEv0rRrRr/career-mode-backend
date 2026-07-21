import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PositionsRepository {
  constructor(private prisma: PrismaClient) {}

  findAll() {
    return this.prisma.position.findMany();
  }
}
