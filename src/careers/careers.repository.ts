import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';

@Injectable()
export class CareersRepository {
  constructor(private prisma: PrismaService) {}

  findCurrentCareer() {
    return this.prisma.career.findFirst({
      where: {
        completed: false,
      },
    });
  }

  findCurrentCareerByClubId(clubId: number) {
    return this.prisma.career.findFirst({
      where: {
        clubId,
        completed: false,
      },
    });
  }

  findById(id: number) {
    return this.prisma.career.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.career.findMany();
  }

  create(data: CreateCareerDto) {
    return this.prisma.career.create({
      data: {
        ...data,
        startDate: new Date(),
        endDate: null,
        completed: false,
      },
    });
  }

  completeCurrentCareer(careerId: number) {
    return this.prisma.career.update({
      where: {
        id: careerId,
      },
      data: {
        endDate: new Date(),
        completed: true,
      },
    });
  }

  completeCareer(careerId: number) {
    return this.prisma.career.update({
      where: {
        id: careerId,
      },
      data: {
        endDate: new Date(),
        completed: true,
      },
    });
  }

  delete(id: number) {
    return this.prisma.career.delete({ where: { id } });
  }
}
