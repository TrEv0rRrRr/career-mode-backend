import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransferType } from '@prisma/client';
import { ManagersService } from '../managers/managers.service.ts';
import { MatchMapper } from '../matches/dto/mapper/match.mapper.ts';
import { PlayersService } from '../players/players.service.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { CreateTransferDto } from '../transfers/dto/create-transfer.dto.ts';
import { TransfersService } from '../transfers/transfers.service.ts';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { FireManagerDto } from './dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from './dto/managers/hire-manager.dto.ts';
import { TeamMapper } from './dto/mapper/team.mapper.ts';
import { ChangePlayerJerseyNumberDto } from './dto/players/change-player-jersey-number.dto.ts';
import { ReleasePlayerDto } from './dto/players/release-player.dto.ts';
import { SignPlayerDto } from './dto/players/sign-player.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';
import { TeamNotFoundException } from './exceptions/team-not-found.exception.ts';
import { TeamsRepository } from './teams.repository.ts';

@Injectable()
export class TeamsService {
  constructor(
    private repo: TeamsRepository,
    private playersService: PlayersService,
    private seasonsService: SeasonsService,
    private managersService: ManagersService,
    private transfersService: TransfersService,
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

  async findSquad(teamId: number) {
    await this.findTeamById(teamId);

    const pt = await this.repo.findPlayers(teamId);

    return pt.map((pt) => TeamMapper.teamPlayerToResponse(pt));
  }

  async signPlayer(teamId: number, playerId: number, data: SignPlayerDto) {
    await this.playersService.findPlayerById(playerId);

    await this.findTeamById(teamId);

    const season = await this.seasonsService.findCurrentSeason();

    const isThePlayerOnATeam =
      await this.playersService.findCurrentTeam(playerId);

    if (isThePlayerOnATeam)
      throw new ConflictException(
        'This player is currently playing for a team. You must end his contract first',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    const transfer: CreateTransferDto = {
      fee: 0,
      date: data.startDate,
      playerId,
      toTeamId: teamId,
      jerseyNumber: data.jerseyNumber,
      seasonId: season.id,
    };

    await this.transfersService.completeTransfer(
      transfer,
      TransferType.FREE_AGENT,
    );

    return this.repo.signPlayer(teamId, playerId, data);
  }

  async changePlayerJerseyNumber(
    teamId: number,
    playerId: number,
    data: ChangePlayerJerseyNumberDto,
  ) {
    await this.findTeamById(teamId);
    await this.playersService.findPlayerById(playerId);

    const currentContract = await this.playersService.findCurrentTeam(playerId);

    const currentSquad = await this.findSquad(teamId);

    if (!currentContract)
      throw new NotFoundException(
        'This player is not playing for any team currently',
      );

    const isTheNumberAlreadyInUse = currentSquad.some(
      (squad) =>
        squad.player.id !== playerId &&
        squad.jerseyNumber === data.jerseyNumber,
    );

    if (isTheNumberAlreadyInUse)
      throw new BadRequestException('The requested number is already in use');

    return this.repo.changePlayerJerseyNumber(currentContract.id, data);
  }

  async releasePlayer(playerId: number, data: ReleasePlayerDto) {
    await this.playersService.findPlayerById(playerId);

    const currentContract = await this.playersService.findCurrentTeam(playerId);

    if (!currentContract)
      throw new NotFoundException(
        'This player is not currently playing for a team',
      );

    if (data.endDate < currentContract.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.releasePlayer(currentContract.id, data);
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

  // ! Manager Team Service Methods

  async findCurrentManager(teamId: number) {
    await this.findTeamById(teamId);
    const currentManager = await this.repo.findCurrentManager(teamId);
    if (!currentManager) throw new NotFoundException('This nt has no manager');

    return TeamMapper.mapManagers(currentManager);
  }

  async findManagerHistory(teamId: number) {
    await this.findTeamById(teamId);

    const history = await this.repo.findTeamManagerHistory(teamId);
    return history.map((h) => TeamMapper.mapManagers(h));
  }

  async hireManager(teamId: number, managerId: number, data: HireManagerDto) {
    await this.findTeamById(teamId);
    await this.managersService.findManagerById(managerId);

    const currentTeam =
      await this.managersService.findManagerCurrentTeam(managerId);

    if (currentTeam)
      throw new BadRequestException(
        'The manager is already managing another team.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.hireManager(teamId, managerId, data);
  }

  async fireManager(teamId: number, data: FireManagerDto) {
    await this.findTeamById(teamId);
    const currentManager = await this.findCurrentManager(teamId);

    if (!currentManager)
      throw new BadRequestException('This team has no manager');

    if (currentManager.startDate > data.endDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireManager(currentManager.id, data);
  }

  async fireManagerAndHireANewOne(
    teamId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    await this.findTeamById(teamId);
    await this.managersService.findManagerById(managerId);
    const currentManager = await this.findCurrentManager(teamId);

    const currentTeam =
      await this.managersService.findManagerCurrentTeam(managerId);

    // Manager sacking validations

    if (!currentManager)
      throw new BadRequestException('This team has no manager');

    if (currentManager.startDate > data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    // Manager hiring validations

    if (currentTeam)
      throw new BadRequestException(
        'The manager is already managing another team.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireAndHireManager(
      currentManager.id,
      teamId,
      managerId,
      data,
    );
  }
}
