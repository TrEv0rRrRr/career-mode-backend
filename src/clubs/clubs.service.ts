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
import { ClubsRepository } from './clubs.repository.ts';
import { CreateClubDto } from './dto/create-club.dto.ts';
import { FireManagerDto } from './dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from './dto/managers/hire-manager.dto.ts';
import { ClubMapper } from './dto/mapper/club.mapper.ts';
import { ChangePlayerJerseyNumberDto } from './dto/players/change-player-jersey-number.dto.ts';
import { ReleasePlayerDto } from './dto/players/release-player.dto.ts';
import { SignPlayerDto } from './dto/players/sign-player.dto.ts';
import { UpdateClubDto } from './dto/update-club.dto.ts';
import { ClubNotFoundException } from './exceptions/club-not-found.exception.ts';

@Injectable()
export class ClubsService {
  constructor(
    private repo: ClubsRepository,
    private playersService: PlayersService,
    private seasonsService: SeasonsService,
    private managersService: ManagersService,
    private transfersService: TransfersService,
  ) {}

  async findClubs() {
    const clubs = await this.repo.findAll();
    return clubs.map((t) => ClubMapper.toResponse(t));
  }

  async findClubById(id: number, errorMsg?: string) {
    const club = await this.repo.findById(id);

    if (!club) throw new ClubNotFoundException(errorMsg);

    return club;
  }

  async findClubsByLeague(leagueId: number) {
    const clubs = await this.repo.findByLeague(leagueId);
    return clubs.map((t) => ClubMapper.toResponse(t));
  }

  async findClubsByCountry(country: string) {
    const clubs = await this.repo.findByCountry(country);
    return clubs.map((t) => ClubMapper.toResponse(t));
  }

  async findClubByName(name: string) {
    const club = await this.repo.findByName(name);

    if (!club)
      throw new ClubNotFoundException(`The club "${name}" doesn't exist`);

    return club;
  }

  async createClub(data: CreateClubDto) {
    const existing = await this.repo.findByName(data.name);

    if (existing)
      throw new ConflictException('A club with that name already exists');

    return this.repo.create(data);
  }

  async createManyClubs(data: CreateClubDto[]) {
    const clubNames = data.map((club) => club.name);

    const existingClubs = await Promise.all(
      clubNames.map((name) => this.repo.findByName(name)),
    );

    const isFullOfNulls = !existingClubs.every((club) => club === null);

    if (isFullOfNulls)
      throw new ConflictException("There's a club that already exists");

    return this.repo.createMany(data);
  }

  async updateClub(id: number, data: UpdateClubDto) {
    await this.findClubById(id);

    return this.repo.update(id, data);
  }

  async deleteClub(id: number) {
    await this.findClubById(id);

    return this.repo.delete(id);
  }

  // ! Player Club Method

  async findSquad(clubId: number) {
    await this.findClubById(clubId);

    const pt = await this.repo.findPlayers(clubId);

    return pt.map((pt) => ClubMapper.clubPlayerToResponse(pt));
  }

  async signPlayer(clubId: number, playerId: number, data: SignPlayerDto) {
    await this.playersService.findPlayerById(playerId);

    await this.findClubById(clubId);

    const season = await this.seasonsService.findCurrentSeason();

    const isThePlayerOnAClub =
      await this.playersService.findCurrentClub(playerId);

    if (isThePlayerOnAClub)
      throw new ConflictException(
        'This player is currently playing for a club. You must end his contract first',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    const transfer: CreateTransferDto = {
      fee: 0,
      date: data.startDate,
      playerId,
      toClubId: clubId,
      jerseyNumber: data.jerseyNumber,
      seasonId: season.id,
    };

    await this.transfersService.completeTransfer(
      transfer,
      TransferType.FREE_AGENT,
    );

    return this.repo.signPlayer(clubId, playerId, data);
  }

  async changePlayerJerseyNumber(
    clubId: number,
    playerId: number,
    data: ChangePlayerJerseyNumberDto,
  ) {
    await this.findClubById(clubId);
    await this.playersService.findPlayerById(playerId);

    const currentContract = await this.playersService.findCurrentClub(playerId);

    const currentSquad = await this.findSquad(clubId);

    if (!currentContract)
      throw new NotFoundException(
        'This player is not playing for any club currently',
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

    const currentContract = await this.playersService.findCurrentClub(playerId);

    if (!currentContract)
      throw new NotFoundException(
        'This player is not currently playing for a club',
      );

    if (data.endDate < currentContract.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.releasePlayer(currentContract.id, data);
  }

  // ! Player Season Stats Methods

  async findClubPlayerStats(clubId: number) {
    await this.findClubById(clubId);

    const ts = await this.repo.findClubPlayerStats(clubId);

    return ts.map((ts) => ClubMapper.clubSquadStatsToResponse(ts));
  }

  async findClubPlayerStatsBySeason(clubId: number, seasonId: number) {
    await this.findClubById(clubId);
    await this.seasonsService.findSeasonById(seasonId);

    const ts = await this.repo.findClubPlayerStatsBySeason(clubId, seasonId);

    return ts.map((ts) => ClubMapper.clubSquadStatsToResponse(ts));
  }

  // ! Club Season Methods

  async findClubStats(clubId: number) {
    await this.findClubById(clubId);

    const tss = await this.repo.findClubStats(clubId);

    return tss.map((tss) => ClubMapper.clubSeasonStatsToResponse(tss));
  }

  async findClubStatsBySeason(clubId: number, seasonId: number) {
    await this.findClubById(clubId);
    await this.seasonsService.findSeasonById(seasonId);

    const tss = await this.repo.findClubStatsBySeason(clubId, seasonId);

    if (!tss)
      throw new BadRequestException("There's no stats for the given season");

    return ClubMapper.clubSeasonStatsToResponse(tss);
  }

  // ! Club Maches Methods

  async findClubMatches(clubId: number) {
    await this.findClubById(clubId);
    const tm = await this.repo.findClubMatches(clubId);
    return tm.map((tm) => MatchMapper.toResponse(tm));
  }

  // ! Manager Club Service Methods

  async findCurrentManager(clubId: number) {
    await this.findClubById(clubId);
    const currentManager = await this.repo.findCurrentManager(clubId);
    if (!currentManager) throw new NotFoundException('This nt has no manager');

    return ClubMapper.mapManagers(currentManager);
  }

  async findManagerHistory(clubId: number) {
    await this.findClubById(clubId);

    const history = await this.repo.findClubManagerHistory(clubId);
    return history.map((h) => ClubMapper.mapManagers(h));
  }

  async hireManager(clubId: number, managerId: number, data: HireManagerDto) {
    await this.findClubById(clubId);
    await this.managersService.findManagerById(managerId);

    const currentClub =
      await this.managersService.findManagerCurrentClub(managerId);

    if (currentClub)
      throw new BadRequestException(
        'The manager is already managing another club.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.hireManager(clubId, managerId, data);
  }

  async fireManager(clubId: number, data: FireManagerDto) {
    await this.findClubById(clubId);
    const currentManager = await this.findCurrentManager(clubId);

    if (!currentManager)
      throw new BadRequestException('This club has no manager');

    if (currentManager.startDate > data.endDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireManager(currentManager.id, data);
  }

  async fireManagerAndHireANewOne(
    clubId: number,
    managerId: number,
    data: HireManagerDto,
  ) {
    await this.findClubById(clubId);
    await this.managersService.findManagerById(managerId);
    const currentManager = await this.findCurrentManager(clubId);

    const currentClub =
      await this.managersService.findManagerCurrentClub(managerId);

    // Manager sacking validations

    if (!currentManager)
      throw new BadRequestException('This club has no manager');

    if (currentManager.startDate > data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    // Manager hiring validations

    if (currentClub)
      throw new BadRequestException(
        'The manager is already managing another club.',
      );

    if (data.endDate && data.endDate < data.startDate)
      throw new BadRequestException(
        'The end date cannot be before the start date',
      );

    return this.repo.fireAndHireManager(
      currentManager.id,
      clubId,
      managerId,
      data,
    );
  }
}
