import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignPlayerDto } from '../clubs/dto/players/sign-player.dto.ts';
import { ClubNotFoundException } from '../clubs/exceptions/club-not-found.exception.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { PlayerMapper } from './dto/mapper/player.mapper.ts';
import { CreatePlayerDto } from './dto/player/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/player/update-player.dto.ts';
import { AssignPositionsDto } from './dto/positions/assign-positions.dto.ts';
import { UpdatePlayerPositionDto } from './dto/positions/update-player-position.dto.ts';
import { PlayerNotFoundException } from './exceptions/player-not-found.exception.ts';
import { PlayersRepository } from './players.repository.ts';

@Injectable()
export class PlayersService {
  constructor(
    private repo: PlayersRepository,
    private seasonsService: SeasonsService,
  ) {}

  // ! Player Methods

  async findPlayers() {
    const players = await this.repo.findAll();

    return players.map((player) => PlayerMapper.toResponse(player));
  }

  async findPlayerById(id: number) {
    const player = await this.repo.findById(id);

    if (!player) throw new PlayerNotFoundException();

    return PlayerMapper.toResponse(player);
  }

  async findPlayerByName(name: string) {
    const player = await this.repo.findByName(name);

    if (!player) throw new PlayerNotFoundException();

    return PlayerMapper.toResponse(player);
  }

  async createPlayer(data: CreatePlayerDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A player with that name already exists');

    return this.repo.create(data);
  }

  async createManyPlayers(data: CreatePlayerDto[]) {
    const playerNames = data.map((player) => player.name);

    const existingPlayers = await Promise.all(
      playerNames.map((name) => this.repo.findByName(name)),
    );

    const isFullOfNulls = !existingPlayers.every((player) => player === null);

    if (isFullOfNulls)
      throw new ConflictException(`There's a player that already exists`);

    return this.repo.createMany(data);
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

    const playerPositions = await this.repo.findPlayerPositions(playerId);

    return playerPositions.map((pp) => PlayerMapper.positionsToResponse(pp));
  }

  async assignPositions(playerId: number, data: AssignPositionsDto) {
    await this.findPlayerById(playerId);

    const positions = await this.findPlayerPositions(playerId);

    const theresAMainPosition = positions.find(
      (position) => position.isPrimary,
    );

    if (theresAMainPosition)
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

  // ! Player Club Methods

  async findPlayerClubHistory(playerId: number) {
    await this.findPlayerById(playerId);
    const history = await this.repo.findPlayerClubHistory(playerId);
    return history.map((h) => PlayerMapper.clubsToResponse(h));
  }

  async findCurrentClub(playerId: number) {
    await this.findPlayerById(playerId);
    const currentClub = await this.repo.findCurrentClub(playerId);
    if (!currentClub)
      throw new NotFoundException(
        'This player is not playing for a club currently',
      );
    return currentClub;
  }

  // ! Dev only
  async findCurrentClubs(playerIds: number[]) {
    return this.repo.findCurrentClubs(playerIds);
  }

  // ! Dev only
  async replacePlayerClubs(
    clubId: number,
    playerId: number,
    data: SignPlayerDto[],
  ) {
    await this.findPlayerById(playerId);

    for (const club of data) {
      if (club.endDate && club.endDate < club.startDate) {
        throw new BadRequestException(
          'The end date cannot be before the start date.',
        );
      }
    }

    if (data.length && !(await this.repo.clubExists(clubId)))
      throw new ClubNotFoundException();

    const activeContracts = data.filter((club) => club.endDate === null);

    if (activeContracts.length > 1) {
      throw new ConflictException(
        'A player cannot have more than one active contract.',
      );
    }

    return this.repo.replacePlayerClubs(clubId, playerId, data);
  }

  // ! Dev only
  async deletePlayerClub(playerClubId: number, playerId: number) {
    await this.findPlayerById(playerId);

    await this.findCurrentClub(playerClubId);

    return this.repo.deletePlayerClub(playerClubId);
  }

  // ! Player season stats Methods

  async findPlayerSeasonStats(playerId: number) {
    await this.findPlayerById(playerId);

    const playerSeasonStats = await this.repo.findPlayerSeasonStats(playerId);

    return playerSeasonStats.map((pss) =>
      PlayerMapper.seasonStatsToResponse(pss),
    );
  }

  async findPlayerClubSeasonStats(
    playerId: number,
    clubId: number,
    seasonId: number,
  ) {
    await this.findPlayerById(playerId);
    if (!(await this.repo.clubExists(clubId)))
      throw new ClubNotFoundException();
    await this.seasonsService.findSeasonById(seasonId);

    const playerClubSeasonStats =
      await this.repo.findPlayerStatsBySeasonAndClub(
        playerId,
        clubId,
        seasonId,
      );

    if (!playerClubSeasonStats)
      throw new BadRequestException(
        'This player has no stats because he has not played any match this season',
      );

    return PlayerMapper.clubSeasonStatsToResponse(playerClubSeasonStats);
  }

  // ! Player NT Methods

  async findPlayerCallUpHistory(playerId: number) {
    await this.findPlayerById(playerId);
    const history = await this.repo.findPlayerCallUpHistory(playerId);
    return history.map((h) => PlayerMapper.nationalTeamsToResponse(h));
  }

  async findPlayerCurrentCallUp(playerId: number) {
    await this.findPlayerById(playerId);

    const currentCallUp = await this.repo.findPlayerCurrentCallUp(playerId);

    if (!currentCallUp)
      throw new BadRequestException(
        'This player has not been called up for his national club',
      );

    return PlayerMapper.nationalTeamsToResponse(currentCallUp);
  }
}
