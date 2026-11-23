import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateStadiumDto } from './dto/create-stadium.dto.ts';
import { UpdateStadiumDto } from './dto/update-stadium.dto.ts';

const stadiumInclude = {
  clubs: true,
  nationalTeams: true,
};

export type StadiumWithRelations = Prisma.StadiumGetPayload<{
  include: typeof stadiumInclude;
}>;

@Injectable()
export class StadiumsRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.stadium.findUnique({
      where: { id },
      include: stadiumInclude,
    });
  }

  findAll() {
    return this.prisma.stadium.findMany({
      include: stadiumInclude,
    });
  }

  findByName(name: string) {
    return this.prisma.stadium.findUnique({ where: { name } });
  }

  create(data: CreateStadiumDto) {
    return this.prisma.stadium.create({
      data,
    });
  }

  createMany(data: CreateStadiumDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.stadium.createMany({ data });
    });
  }

  update(id: number, data: UpdateStadiumDto) {
    return this.prisma.stadium.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.stadium.delete({ where: { id } });
  }
}
