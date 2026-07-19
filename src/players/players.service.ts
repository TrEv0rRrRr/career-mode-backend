import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
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
}
