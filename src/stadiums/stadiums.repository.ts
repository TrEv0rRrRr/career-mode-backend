import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateStadiumDto } from './dto/create-stadium.dto.ts';
import { UpdateStadiumDto } from './dto/update-stadium.dto.ts';

@Injectable()
export class StadiumsRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.stadium.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.stadium.findMany();
  }

  findByName(name: string) {
    return this.prisma.stadium.findFirst({ where: { name } });
  }

  create(data: CreateStadiumDto) {
    return this.prisma.stadium.create({
      data,
    });
  }

  update(id: number, data: UpdateStadiumDto) {
    return this.prisma.stadium.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.stadium.delete({ where: { id } });
  }
}
