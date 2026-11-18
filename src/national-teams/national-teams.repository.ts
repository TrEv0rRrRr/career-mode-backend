import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';

@Injectable()
export class NationalTeamsRepository {
  constructor(private prisma: PrismaService) {}
}
