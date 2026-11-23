import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto.ts';
import { ManagerMapper } from './dto/mapper/manager.mapper.ts';
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

    const isFullOfNulls = !existingManagers.every(
      (manager) => manager === null,
    );

    if (isFullOfNulls)
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

  // ! Manager Club Service Methods
  async findManagerCurrentClub(managerId: number) {
    await this.findManagerById(managerId);

    const currentClub = await this.repo.findManagerCurrentClub(managerId);

    if (!currentClub)
      throw new NotFoundException(
        'This manager is not managing any team currently',
      );

    return ManagerMapper.mapClubs(currentClub);
  }

  async findManagerClubHistory(managerId: number) {
    await this.findManagerById(managerId);
    const history = await this.repo.findManagerClubHistory(managerId);
    return history.map((h) => ManagerMapper.mapClubs(h));
  }

  // ! Manager National Club Service Methods
  async findManagerCurrentNationalTeam(managerId: number) {
    await this.findManagerById(managerId);

    const currentNationalTeam =
      await this.repo.findManagerCurrentNationalTeam(managerId);

    if (!currentNationalTeam)
      throw new NotFoundException(
        'This manager is not managing any national team currently',
      );
    return ManagerMapper.mapNationalTeams(currentNationalTeam);
  }

  async findManagerNationalTeamHistory(managerId: number) {
    await this.findManagerById(managerId);
    const history = await this.repo.findManagerNationalTeamHistory(managerId);
    return history.map((h) => ManagerMapper.mapNationalTeams(h));
  }
}
