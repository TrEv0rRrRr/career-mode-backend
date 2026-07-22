import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';
import { TeamNotFoundException } from './exceptions/team-not-found.exception.ts';
import { TeamsRepository } from './teams.repository.ts';

@Injectable()
export class TeamsService {
  constructor(private repo: TeamsRepository) {}

  findTeams() {
    return this.repo.findAll();
  }

  async findTeamById(id: number) {
    const team = await this.repo.findById(id);

    if (!team) throw new TeamNotFoundException();

    return team;
  }

  findTeamsByLeague(leagueId: number) {
    return this.repo.findByLeague(leagueId);
  }

  findTeamsByCountry(country: string) {
    return this.repo.findByCountry(country);
  }

  async findTeamByName(name: string) {
    const team = await this.repo.findByName(name);

    if (!team) throw new TeamNotFoundException();

    return team;
  }

  async createTeam(data: CreateTeamDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A team with that name already exists');

    return this.repo.create(data);
  }

  async updateTeam(id: number, data: UpdateTeamDto) {
    await this.findTeamById(id);

    return this.repo.update(id, data);
  }

  async deleteTeam(id: number) {
    await this.findTeamById(id);

    return this.repo.delete(id);
  }

  async findPlayers(teamId: number) {
    await this.findTeamById(teamId);

    return this.repo.findPlayers(teamId);
  }
}
