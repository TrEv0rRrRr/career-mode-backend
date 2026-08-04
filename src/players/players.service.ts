import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CreatePlayerDto } from './dto/player/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/player/update-player.dto.ts';
import { AssignPositionsDto } from './dto/positions/assign-positions.dto.ts';
import { UpdatePlayerPositionDto } from './dto/positions/update-player-position.dto.ts';
import { AssignTeamDto } from './dto/teams/assign-team.dto.ts';
import { UpdatePlayerTeamDto } from './dto/teams/update-player-team.dto.ts';
import { PlayerNotFoundException } from './exceptions/player-not-found.exception.ts';
import { PlayerTeamNotFoundException } from './exceptions/player-team-not-found.exception.ts';
import { PlayersRepository } from './players.repository.ts';

@Injectable()
export class PlayersService {
  constructor(
    private repo: PlayersRepository,
    private teamsService: TeamsService,
    private seasonsService: SeasonsService,
  ) {}

  // ! Player Methods

  findPlayers() {
    return this.repo.findAll();
  }

  async findPlayerById(id: number) {
    const player = await this.repo.findById(id);

    if (!player) throw new PlayerNotFoundException();

    return player;
  }

  async findPlayerByName(name: string) {
    const player = await this.repo.findByName(name);

    if (!player) throw new PlayerNotFoundException();

    return player;
  }

  async createPlayer(data: CreatePlayerDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A player with that name already exists');

    return this.repo.create(data);
  }

  async updatePlayer(id: number, data: UpdatePlayerDto) {
    await this.findPlayerById(id);

    return this.repo.update(id, data);
  }

  async deletePlayer(id: number) {
    await this.findPlayerById(id);

    return this.repo.delete(id);
  }

  // ! Player Position Methods

  async findPlayerPositions(playerId: number) {
    await this.findPlayerById(playerId);

    return this.repo.findPlayerPositions(playerId);
  }

  async assignPositions(playerId: number, data: AssignPositionsDto) {
    await this.findPlayerById(playerId);

    if (data.isPrimary)
      throw new ConflictException("There's already a main position");

    return this.repo.assignPositions(playerId, data);
  }

  async replacePlayerPositions(playerId: number, data: AssignPositionsDto[]) {
    await this.findPlayerById(playerId);

    return this.repo.replacePlayerPositions(playerId, data);
  }

  async updatePlayerPosition(
    playerId: number,
    positionId: number,
    data: UpdatePlayerPositionDto,
  ) {
    await this.findPlayerById(playerId);

    const playerPosition = await this.repo.findPlayerPosition(
      playerId,
      positionId,
    );

    const anotherMainPosition = await this.repo.findAnotherMainPosition(
      playerId,
      positionId,
    );

    if (playerPosition?.isPrimary && !data.isPrimary && !anotherMainPosition)
      throw new ConflictException(
        'A player cannot be left without a primary position.',
      );

    if (data.isPrimary) await this.repo.makePositionsNotPrimary(playerId);

    return this.repo.updatePlayerPosition(playerId, positionId, data);
  }

  async deletePlayerPosition(playerId: number, positionId: number) {
    await this.findPlayerById(playerId);

    return this.repo.deletePlayerPosition(playerId, positionId);
  }

  // ! Player Team Methods

  async findPlayerTeam(playerTeamId: number) {
    const playerTeam = await this.repo.findPlayerTeam(playerTeamId);
    if (!playerTeam) throw new PlayerTeamNotFoundException();
    return playerTeam;
  }

  async findPlayerTeams(playerId: number) {
    await this.findPlayerById(playerId);
    return this.repo.findPlayerTeams(playerId);
  }

  async findCurrentTeam(playerId: number) {
    await this.findPlayerById(playerId);
    return this.repo.findCurrentTeam(playerId);
  }

  async findCurrentTeams(playerIds: number[]) {
    return this.repo.findCurrentTeams(playerIds);
  }

  async assignTeam(playerId: number, data: AssignTeamDto) {
    await this.findPlayerById(playerId);

    await this.teamsService.findTeamById(data.teamId);

    const isThePlayerOnATeam = await this.findCurrentTeam(playerId);

    if (isThePlayerOnATeam)
      throw new ConflictException(
        'This player is currently playing for a team. You must end his contract first',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.assignTeam(playerId, data);
  }

  async replacePlayerTeams(playerId: number, data: AssignTeamDto[]) {
    await this.findPlayerById(playerId);

    for (const team of data) {
      if (team.endDate && team.endDate < team.startDate) {
        throw new BadRequestException(
          'The end date cannot be before the start date.',
        );
      }
    }

    await Promise.all(
      data.map((team) => this.teamsService.findTeamById(team.teamId)),
    );

    const activeContracts = data.filter((team) => team.endDate === null);

    if (activeContracts.length > 1) {
      throw new ConflictException(
        'A player cannot have more than one active contract.',
      );
    }

    return this.repo.replacePlayerTeams(playerId, data);
  }

  async updatePlayerTeam(
    playerId: number,
    playerTeamId: number,
    data: UpdatePlayerTeamDto,
  ) {
    await this.findPlayerById(playerId);

    const playerCurrentTeam = await this.findCurrentTeam(playerId);

    if (
      data.endDate &&
      playerCurrentTeam &&
      data.endDate < playerCurrentTeam.startDate
    )
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.updatePlayerTeam(playerTeamId, data);
  }

  async deletePlayerTeam(playerTeamId: number, playerId: number) {
    await this.findPlayerById(playerId);

    await this.findPlayerTeam(playerTeamId);

    return this.repo.deletePlayerTeam(playerTeamId);
  }

  // ! Player season stats Methods

  async findPlayerSeasonStats(playerId: number) {
    await this.findPlayerById(playerId);

    return this.repo.findPlayerSeasonStats(playerId);
  }

  async findPlayerTeamSeasonStats(
    playerId: number,
    teamId: number,
    seasonId: number,
  ) {
    await this.findPlayerById(playerId);
    await this.teamsService.findTeamById(teamId);
    await this.seasonsService.findSeasonById(seasonId);

    return this.repo.findPlayerStatsBySeasonAndTeam(playerId, teamId, seasonId);
  }
}
