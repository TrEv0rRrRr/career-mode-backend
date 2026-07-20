import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';

@Injectable()
export class CareersRepository {
  constructor(private prisma: PrismaService) {}
  findById(id: number) {
    return this.prisma.career.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.career.findMany();
  }

  create(data: CreateCareerDto) {
    return this.prisma.career.create({ data });
  }

  delete(id: number) {
    return this.prisma.career.delete({ where: { id } });
  }
}
