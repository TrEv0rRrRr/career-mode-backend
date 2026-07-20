import { Injectable } from '@nestjs/common';
import { CareersRepository } from './careers.repository.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';
import { CareerNotFoundException } from './exceptions/career-not-found.exception.ts';

@Injectable()
export class CareersService {
  constructor(private repo: CareersRepository) {}

  findCareers() {
    return this.repo.findAll();
  }

  async findCareerById(id: number) {
    const career = await this.repo.findById(id);

    if (!career) throw new CareerNotFoundException();

    return career;
  }

  createCareer(data: CreateCareerDto) {
    return this.repo.create(data);
  }

  async deleteCareer(id: number) {
    await this.findCareerById(id);

    return this.repo.delete(id);
  }
}
