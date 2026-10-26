import { ConflictException, Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto.ts';
import { UpdateManagerDto } from './dto/update-manager.dto.ts';
import { ManagerNotFoundException } from './exceptions/manager-not-found.exception.ts';
import { ManagersRepository } from './managers.repository.ts';

@Injectable()
export class ManagersService {
  constructor(private repo: ManagersRepository) {}

  findManagers() {
    return this.repo.findAll();
  }

  async findManagerById(id: number) {
    const manager = await this.repo.findById(id);

    if (!manager) throw new ManagerNotFoundException();

    return manager;
  }

  async createManager(data: CreateManagerDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A manager with that name already exists');

    return this.repo.create(data);
  }

  async createManyManagers(data: CreateManagerDto[]) {
    const managerNames = data.map((manager) => manager.name);

    const existingManagers = await Promise.all(
      managerNames.map((name) => this.repo.findByName(name)),
    );

    if (existingManagers.length !== 0)
      throw new ConflictException("There's a manager that already exists");

    return this.repo.createMany(data);
  }

  async updateManager(id: number, data: UpdateManagerDto) {
    await this.findManagerById(id);

    return this.repo.update(id, data);
  }

  async deleteManager(id: number) {
    await this.findManagerById(id);

    return this.repo.delete(id);
  }
}
