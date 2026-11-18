import { ConflictException, Injectable } from '@nestjs/common';
import { Confederation } from '@prisma/client';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { NationalTeamMapper } from './dto/mapper/national-team.mapper.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';
import { NationalTeamNotFoundException } from './exceptions/national-team-not-found.exception.ts';
import { NationalTeamsRepository } from './national-teams.repository.ts';

@Injectable()
export class NationalTeamsService {
  constructor(private repo: NationalTeamsRepository) {}

  async findNationalTeamById(id: number) {
    const nt = await this.repo.findById(id);

    if (!nt) throw new NationalTeamNotFoundException();

    return nt;
  }

  async findNationalTeamByName(name: string) {
    const nt = await this.repo.findByName(name);

    if (!nt) throw new NationalTeamNotFoundException();

    return nt;
  }

  async findAllNationalTeams() {
    const nt = await this.repo.findAll();
    return nt.map((nt) => NationalTeamMapper.toResponse(nt));
  }

  async findNationalTeamsByConfederation(conf: Confederation) {
    const nt = await this.repo.findByConfederation(conf);
    return nt.map((nt) => NationalTeamMapper.toResponse(nt));
  }

  async createNationalTeam(data: CreateNationalTeamDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A team with that name already exists');

    return this.repo.create(data);
  }

  async createManyNationalTeams(data: CreateNationalTeamDto[]) {
    const ntNames = data.map((nt) => nt.name);

    const existingNTs = await Promise.all(
      ntNames.map((name) => this.repo.findByName(name)),
    );

    const isFullOfNulls = !existingNTs.every((nt) => nt === null);

    if (isFullOfNulls)
      throw new ConflictException("There's a nt that already exists");

    return this.repo.createMany(data);
  }

  async updateNationalTeam(id: number, data: UpdateNationalTeamDto) {
    await this.findNationalTeamById(id);

    return this.repo.update(id, data);
  }

  async deleteNationalTeam(id: number) {
    await this.findNationalTeamById(id);

    return this.repo.delete(id);
  }
}
