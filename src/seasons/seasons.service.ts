import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto.ts';
import { SeasonNotFoundException } from './exceptions/season-not-found.exception.ts';
import { SeasonsRepository } from './seasons.repository.ts';

@Injectable()
export class SeasonsService {
  constructor(private repo: SeasonsRepository) {}

  findSeasons() {
    return this.repo.findAll();
  }

  async findSeasonById(id: number) {
    const season = await this.repo.findById(id);

    if (!season) throw new SeasonNotFoundException();

    return season;
  }

  async findSeasonByCode(code: string) {
    const season = await this.repo.findByCode(code);

    if (!season) throw new SeasonNotFoundException();

    return season;
  }

  async createSeason(data: CreateSeasonDto) {
    const existing = await this.repo.findByCode(data.code);

    if (existing)
      throw new ConflictException('That season has already been created.');

    return this.repo.create(data);
  }

  async deleteSeason(id: number) {
    await this.findSeasonById(id);

    return this.repo.delete(id);
  }

  async findAllTeamStats(seasonId: number) {
    await this.findSeasonById(seasonId);

    return this.repo.findAllTeamStats(seasonId);
  }
}
