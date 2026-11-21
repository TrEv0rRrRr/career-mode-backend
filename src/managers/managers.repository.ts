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

  createMany(data: CreateManagerDto[]) {
    return this.prisma.$transaction(async (tx) => {
      return tx.manager.createMany({ data });
    });
  }

  update(id: number, data: UpdateManagerDto) {
    return this.prisma.manager.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.manager.delete({ where: { id } });
  }

  // ! Manager Team Queries

  findManagerCurrentTeam(managerId: number) {
    return this.prisma.managerTeam.findFirst({
      where: {
        managerId,
        endDate: null,
      },
      include: {
        team: true,
      },
    });
  }

  findManagerTeamHistory(managerId: number) {
    return this.prisma.managerTeam.findMany({
      where: {
        managerId,
      },
      include: {
        team: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // ! Manager National Team Queries

  findManagerCurrentNationalTeam(managerId: number) {
    return this.prisma.managerNationalTeam.findFirst({
      where: {
        managerId,
        endDate: null,
      },
      include: {
        nationalTeam: true,
      },
    });
  }

  findManagerNationalTeamHistory(managerId: number) {
    return this.prisma.managerNationalTeam.findMany({
      where: {
        managerId,
      },
      include: {
        nationalTeam: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
