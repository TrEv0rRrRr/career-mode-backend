import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStadiumDto } from './dto/create-stadium.dto.ts';
import { UpdateStadiumDto } from './dto/update-stadium.dto.ts';
import { StadiumNotFoundException } from './exceptions/stadium-not-found.exception.ts';
import { StadiumsRepository } from './stadiums.repository.ts';

@Injectable()
export class StadiumsService {
  constructor(private repo: StadiumsRepository) {}

  findStadiums() {
    return this.repo.findAll();
  }

  async findStadiumById(id: number) {
    const stadium = await this.repo.findById(id);

    if (!stadium) throw new StadiumNotFoundException();

    return stadium;
  }

  async createStadium(data: CreateStadiumDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A stadium with that name already exists');

    return this.repo.create(data);
  }

  async createManyStadiums(data: CreateStadiumDto[]) {
    const stadiumNames = data.map((stadium) => stadium.name);

    const existingStadiums = await Promise.all(
      stadiumNames.map((name) => this.repo.findByName(name)),
    );

    const isFullOfNulls = !existingStadiums.every(
      (stadium) => stadium === null,
    );

    if (isFullOfNulls)
      throw new ConflictException(`There's a stadium that already exists`);

    return this.repo.createMany(data);
  }

  async updateStadium(id: number, data: UpdateStadiumDto) {
    await this.findStadiumById(id);

    return this.repo.update(id, data);
  }

  async deleteStadium(id: number) {
    await this.findStadiumById(id);

    return this.repo.delete(id);
  }
}
