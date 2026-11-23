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

  // ! Manager Club Queries

  findManagerCurrentClub(managerId: number) {
    return this.prisma.managerClub.findFirst({
      where: {
        managerId,
        endDate: null,
      },
      include: {
        club: true,
      },
    });
  }

  findManagerClubHistory(managerId: number) {
    return this.prisma.managerClub.findMany({
      where: {
        managerId,
      },
      include: {
        club: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // ! Manager National Club Queries

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
