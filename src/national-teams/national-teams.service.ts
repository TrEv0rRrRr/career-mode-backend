import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Confederation } from '@prisma/client';
import { FireManagerDto } from '../clubs/dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from '../clubs/dto/managers/hire-manager.dto.ts';
import { ManagersService } from '../managers/managers.service.ts';
import { MatchMapper } from '../matches/dto/mapper/match.mapper.ts';
import { PlayersService } from '../players/players.service.ts';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { NationalTeamMapper } from './dto/mapper/national-team.mapper.ts';
import { CallUpPlayerDto } from './dto/players/callup-player.dto.ts';
import { DismissPlayerDto } from './dto/players/dismiss-player.dto.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';
import { NationalTeamNotFoundException } from './exceptions/national-team-not-found.exception.ts';
import { NationalTeamsRepository } from './national-teams.repository.ts';

@Injectable()
export class NationalTeamsService {
  constructor(
    private repo: NationalTeamsRepository,
    private managersService: ManagersService,
    private playersService: PlayersService,
  ) {}

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

  // ! National Team Matches Methods

  async findNationalTeamMatches(ntId: number) {
    await this.findNationalTeamById(ntId);
    const ntm = await this.repo.findNationalTeamMatches(ntId);
    return ntm.map((ntm) => MatchMapper.toResponse(ntm));
  }

  // ! National Team Players Methods

  async findCalledUpPlayers(ntId: number) {
    await this.findNationalTeamById(ntId);

    const cUP = await this.repo.findCalledUpPlayers(ntId);

    return cUP.map((cup) => NationalTeamMapper.calledUpPlayersToResponse(cup));
  }

  async callUpPlayer(
    playerId: number,
    nationalTeamId: number,
    data: CallUpPlayerDto,
  ) {
    const player = await this.playersService.findPlayerById(playerId);
    const nt = await this.findNationalTeamById(nationalTeamId);

    const currentCallUp =
      await this.playersService.findPlayerCurrentCallUp(playerId);

    if (currentCallUp)
      throw new BadRequestException(
        'The player is already called up for a national team',
      );

    if (player.nationality !== nt.name)
      throw new BadRequestException(
        'The player cannot be called up for this national team',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.callUpPlayer(playerId, nationalTeamId, data);
  }

  async dismissPlayer(playerId: number, data: DismissPlayerDto) {
    const currentCallUp =
      await this.playersService.findPlayerCurrentCallUp(playerId);

    if (!currentCallUp)
      throw new BadRequestException(
        'The player is not currently called up for a national team',
      );

    if (currentCallUp.startDate > data.endDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.dismissPlayer(currentCallUp.id, data);
  }

  // ! Manager Team Service Methods

  async findCurrentManager(nationalTeamId: number) {
    await this.findNationalTeamById(nationalTeamId);
    const currentManager = await this.repo.findCurrentManager(nationalTeamId);
    if (!currentManager) throw new NotFoundException('This nt has no manager');

    return NationalTeamMapper.mapManagers(currentManager);
  }

  async findManagerHistory(nationalTeamId: number) {
    await this.findNationalTeamById(nationalTeamId);
    const history =
      await this.repo.findNationalTeamManagerHistory(nationalTeamId);
    return history.map((h) => NationalTeamMapper.mapManagers(h));
  }

  async hireManager(
    nationalTeamId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    await this.findNationalTeamById(nationalTeamId);
    await this.managersService.findManagerById(managerId);

    const currentTeam =
      await this.managersService.findManagerCurrentNationalTeam(managerId);

    if (!('notFound' in currentTeam))
      throw new BadRequestException(
        'The manager is already managing another nt.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.hireManager(nationalTeamId, managerId, data);
  }

  async fireManager(nationalTeamId: number, data: FireManagerDto) {
    await this.findNationalTeamById(nationalTeamId);
    const currentManager = await this.findCurrentManager(nationalTeamId);

    if (currentManager.startDate > data.endDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireManager(currentManager.id, data);
  }

  async fireManagerAndHireANewOne(
    nationalTeamId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    await this.findNationalTeamById(nationalTeamId);
    await this.managersService.findManagerById(managerId);
    const currentManager = await this.findCurrentManager(nationalTeamId);

    const currentTeam =
      await this.managersService.findManagerCurrentNationalTeam(managerId);

    // Manager sacking validations

    if (!currentManager)
      throw new BadRequestException('This nt has no manager');

    if (currentManager.startDate > data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    // Manager hiring validations

    if (!('notFound' in currentTeam))
      throw new BadRequestException(
        'The manager is already managing another nt.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireAndHireManager(
      currentManager.id,
      nationalTeamId,
      managerId,
      data,
    );
  }
}
