import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';

@Injectable()
export class PositionsRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.position.findMany();
  }
}
