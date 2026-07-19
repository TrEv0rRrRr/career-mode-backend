import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateManagerDto } from './dto/create-manager.dto.ts';
import { UpdateManagerDto } from './dto/update-manager.dto.ts';

@Injectable()
export class ManagersRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.manager.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.manager.findMany();
  }

  findByName(name: string) {
    return this.prisma.manager.findFirst({ where: { name } });
  }

  create(data: CreateManagerDto) {
    return this.prisma.manager.create({
      data,
    });
  }

  update(id: number, data: UpdateManagerDto) {
    return this.prisma.manager.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.manager.delete({ where: { id } });
  }
}
