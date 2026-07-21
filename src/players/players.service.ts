import { ConflictException, Injectable } from '@nestjs/common';
import { AssignPositionsDto } from './dto/assign-positions.dto.ts';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto.ts';
import { UpdatePlayerDto } from './dto/update-player.dto.ts';
import { PlayerNotFoundException } from './exceptions/player-not-found.exception.ts';
import { PlayersRepository } from './players.repository.ts';

@Injectable()
export class PlayersService {
  constructor(private repo: PlayersRepository) {}

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

  replacePlayerPositions(playerId: number, data: AssignPositionsDto[]) {
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
}
