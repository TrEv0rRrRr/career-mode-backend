import { ConflictException, Injectable } from '@nestjs/common';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';
import { TeamNotFoundException } from './exceptions/team-not-found.exception.ts';
import { TeamsRepository } from './teams.repository.ts';

@Injectable()
export class TeamsService {
  constructor(
    private repo: TeamsRepository,
    private seasonsService: SeasonsService,
  ) {}

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

  // ! Player Team Method

  async findPlayers(teamId: number) {
    await this.findTeamById(teamId);

    return this.repo.findPlayers(teamId);
  }

  // ! Player Season Stats Methods

  async findTeamPlayerStats(teamId: number) {
    await this.findTeamById(teamId);

    return this.repo.findTeamPlayerStats(teamId);
  }

  async findTeamPlayerStatsBySeason(teamId: number, seasonId: number) {
    await this.findTeamById(teamId);
    await this.seasonsService.findSeasonById(seasonId);

    return this.repo.findTeamPlayerStatsBySeason(teamId, seasonId);
  }

  // ! Team Season Methods

  async findTeamStats(teamId: number) {
    await this.findTeamById(teamId);

    return this.repo.findTeamStats(teamId);
  }

  async findTeamStatsBySeason(teamId: number, seasonId: number) {
    await this.findTeamById(teamId);
    await this.seasonsService.findSeasonById(seasonId);

    return this.repo.findTeamStatsBySeason(teamId, seasonId);
  }

  // ! Team Maches Methods

  async findTeamMatches(teamId: number) {
    await this.findTeamById(teamId);
    return this.repo.findTeamMatches(teamId);
  }
}
