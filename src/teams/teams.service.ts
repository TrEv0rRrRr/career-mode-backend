import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MatchMapper } from '../matches/dto/mapper/match.mapper.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { TeamMapper } from './dto/mapper/team.mapper.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';
import { TeamNotFoundException } from './exceptions/team-not-found.exception.ts';
import { TeamsRepository } from './teams.repository.ts';

@Injectable()
export class TeamsService {
  constructor(
    private repo: TeamsRepository,
    private seasonsService: SeasonsService,
  ) {}

  async findTeams() {
    const teams = await this.repo.findAll();
    return teams.map((t) => TeamMapper.toResponse(t));
  }

  async findTeamById(id: number, errorMsg?: string) {
    const team = await this.repo.findById(id);

    if (!team) throw new TeamNotFoundException(errorMsg);

    return team;
  }

  async findTeamsByLeague(leagueId: number) {
    const teams = await this.repo.findByLeague(leagueId);
    return teams.map((t) => TeamMapper.toResponse(t));
  }

  async findTeamsByCountry(country: string) {
    const teams = await this.repo.findByCountry(country);
    return teams.map((t) => TeamMapper.toResponse(t));
  }

  async findTeamByName(name: string) {
    const team = await this.repo.findByName(name);

    if (!team)
      throw new TeamNotFoundException(`The team "${name}" doesn't exist`);

    return team;
  }

  async createTeam(data: CreateTeamDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A team with that name already exists');

    return this.repo.create(data);
  }

  async createManyTeams(data: CreateTeamDto[]) {
    const teamNames = data.map((team) => team.name);

    const existingTeams = await Promise.all(
      teamNames.map((name) => this.repo.findByName(name)),
    );

    const isFullOfNulls = !existingTeams.every((team) => team === null);

    if (isFullOfNulls)
      throw new ConflictException("There's a team that already exists");

    return this.repo.createMany(data);
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

    const pt = await this.repo.findPlayers(teamId);

    return pt.map((pt) => TeamMapper.teamPlayerToResponse(pt));
  }

  // ! Player Season Stats Methods

  async findTeamPlayerStats(teamId: number) {
    await this.findTeamById(teamId);

    const ts = await this.repo.findTeamPlayerStats(teamId);

    return ts.map((ts) => TeamMapper.teamSquadStatsToResponse(ts));
  }

  async findTeamPlayerStatsBySeason(teamId: number, seasonId: number) {
    await this.findTeamById(teamId);
    await this.seasonsService.findSeasonById(seasonId);

    const ts = await this.repo.findTeamPlayerStatsBySeason(teamId, seasonId);

    return ts.map((ts) => TeamMapper.teamSquadStatsToResponse(ts));
  }

  // ! Team Season Methods

  async findTeamStats(teamId: number) {
    await this.findTeamById(teamId);

    const tss = await this.repo.findTeamStats(teamId);

    return tss.map((tss) => TeamMapper.teamSeasonStatsToResponse(tss));
  }

  async findTeamStatsBySeason(teamId: number, seasonId: number) {
    await this.findTeamById(teamId);
    await this.seasonsService.findSeasonById(seasonId);

    const tss = await this.repo.findTeamStatsBySeason(teamId, seasonId);

    if (!tss)
      throw new BadRequestException("There's no stats for the given season");

    return TeamMapper.teamSeasonStatsToResponse(tss);
  }

  // ! Team Maches Methods

  async findTeamMatches(teamId: number) {
    await this.findTeamById(teamId);
    const tm = await this.repo.findTeamMatches(teamId);
    return tm.map((tm) => MatchMapper.toResponse(tm));
  }
}
