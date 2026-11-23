import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto.ts';
import { SeasonMapper } from './dto/mapper/season.mapper.ts';
import { SeasonNotFoundException } from './exceptions/season-not-found.exception.ts';
import { SeasonsRepository } from './seasons.repository.ts';

@Injectable()
export class SeasonsService {
  constructor(private repo: SeasonsRepository) {}

  async findSeasons() {
    const seasons = await this.repo.findAll();
    return seasons.map((s) => SeasonMapper.toResponse(s));
  }

  async findSeasonById(id: number) {
    const season = await this.repo.findById(id);

    if (!season) throw new SeasonNotFoundException();

    return SeasonMapper.toResponse(season);
  }

  async findSeasonByCode(code: string) {
    const season = await this.repo.findByCode(code);

    if (!season) throw new SeasonNotFoundException();

    return SeasonMapper.toResponse(season);
  }

  async createSeason(data: CreateSeasonDto) {
    const existing = await this.repo.findByCode(data.code);

    if (existing)
      throw new ConflictException('That season has already been created.');

    return this.repo.create(data);
  }

  async completeCurrentSeason() {
    const currentSeason = await this.findCurrentSeason();

    return this.repo.completeCurrentSeason(currentSeason.id);
  }

  async deleteSeason(id: number) {
    await this.findSeasonById(id);

    return this.repo.delete(id);
  }

  async findAllClubStats(seasonId: number) {
    await this.findSeasonById(seasonId);

    const css = await this.repo.findAllClubStats(seasonId);

    return css.map((c) => SeasonMapper.clubSeasonStatsToResponse(c));
  }

  async findCurrentSeason() {
    const season = await this.repo.findCurrentSeason();

    if (!season) throw new SeasonNotFoundException();

    return SeasonMapper.toResponse(season);
  }
}
