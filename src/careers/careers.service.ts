import { Injectable } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service.ts';
import { CareersRepository } from './careers.repository.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';
import { CareerNotFoundException } from './exceptions/career-not-found.exception.ts';

@Injectable()
export class CareersService {
  constructor(
    private repo: CareersRepository,
    private clubsService: ClubsService,
  ) {}

  findCurrentCareer() {
    return this.repo.findCurrentCareer();
  }

  async findCurrentCareerByClubId(clubId: number) {
    await this.clubsService.findClubById(clubId);

    return this.repo.findCurrentCareerByClubId(clubId);
  }

  findCareers() {
    return this.repo.findAll();
  }

  async findCareerById(id: number) {
    const career = await this.repo.findById(id);

    if (!career) throw new CareerNotFoundException();

    return career;
  }

  async createCareer(data: CreateCareerDto) {
    await this.clubsService.findClubById(data.clubId);

    return this.repo.create(data);
  }

  async completeCurrentCareer() {
    const currentCareer = await this.findCurrentCareer();

    if (!currentCareer) throw new CareerNotFoundException();

    return this.repo.completeCurrentCareer(currentCareer.id);
  }

  async completeCareer(careerId: number) {
    await this.findCareerById(careerId);
    return this.repo.completeCareer(careerId);
  }

  async deleteCareer(id: number) {
    await this.findCareerById(id);

    return this.repo.delete(id);
  }
}
