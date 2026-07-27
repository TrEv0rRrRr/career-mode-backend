import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CompetitionType } from '@prisma/client';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CreateCompetitionEditionDto } from './dto/create-competition-edition.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';
import { CompetitionNotFoundException } from './exceptions/competition-not-found.exception.ts';
import { CompetitionEditionNotFoundException } from './exceptions/edition-not-found.exception.ts';

@Injectable()
export class CompetitionsService {
  constructor(
    private repo: CompetitionsRepository,
    private teamsService: TeamsService,
    private seasonService: SeasonsService,
  ) {}

  async findCompetitionById(id: number) {
    const competition = await this.repo.findById(id);

    if (!competition) throw new CompetitionNotFoundException();

    return competition;
  }

  findCompetitions() {
    return this.repo.findAll();
  }

  findCompetitionsByType(type: CompetitionType) {
    return this.repo.findByType(type);
  }

  // ! Competition Edition methods
  async findEditionsByCompetition(competitionId: number) {
    await this.findCompetitionById(competitionId);

    return this.repo.findEditionsByCompetition(competitionId);
  }

  async findCompetitionEditionById(editionId: number) {
    const edition = await this.repo.findEditionById(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    return edition;
  }

  async findEditionByCompetitionAndSeason(
    competitionId: number,
    seasonId: number,
  ) {
    await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(seasonId);

    const edition = await this.repo.findEditionByCompetitionAndSeason(
      competitionId,
      seasonId,
    );

    if (!edition) throw new CompetitionEditionNotFoundException();

    return edition;
  }

  async createEdition(
    competitionId: number,
    data: CreateCompetitionEditionDto,
  ) {
    await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(data.seasonId);

    const edition = await this.repo.findEditionByCompetitionAndSeason(
      competitionId,
      data.seasonId,
    );

    if (edition)
      throw new BadRequestException(
        'This competition already has an edition for this season.',
      );

    return this.repo.createEdition(competitionId, data);
  }

  async assignWinnerAndRunnerUp(
    competitionId: number,
    editionId: number,
    data: UpdateCompetitionEditionDto,
  ) {
    await this.findCompetitionById(competitionId);

    await this.teamsService.findTeamById(data.winnerTeamId);

    await this.teamsService.findTeamById(data.runnerUpTeamId);

    if (data.winnerTeamId === data.runnerUpTeamId)
      throw new ConflictException(
        'The winner and the runner-up teams must be different',
      );

    const edition = await this.repo.findEditionById(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    const winnerTeam = await this.repo.findCompetitionParticipant(
      editionId,
      data.winnerTeamId,
    );

    const runnerUpTeam = await this.repo.findCompetitionParticipant(
      editionId,
      data.runnerUpTeamId,
    );

    if (!winnerTeam || !runnerUpTeam)
      throw new BadRequestException(
        "You can't assign a team that is not participating in the given competition",
      );

    return this.repo.assignWinnerAndRunnerUp(editionId, data);
  }

  // ! Competition Participant Methods

  async validateData(competitionEditionId: number, teamId: number) {
    await this.findCompetitionEditionById(competitionEditionId);
    await this.teamsService.findTeamById(teamId);
  }

  async findCompetitionParticipants(competitionEditionId: number) {
    await this.findCompetitionEditionById(competitionEditionId);

    return this.repo.findCompetitionParticipants(competitionEditionId);
  }

  async registerParticipant(competitionEditionId: number, teamId: number) {
    await this.teamsService.findTeamById(teamId);
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    const participant = await this.findCompetitionParticipant(
      competitionEditionId,
      teamId,
    );

    if (participant)
      throw new BadRequestException('This team has already been registered');

    const registeredTeams =
      await this.repo.countCompetitionParticipants(competitionEditionId);

    if (registeredTeams >= edition.competition.maxTeamsNumber)
      throw new BadRequestException(
        "You can't register more teams, the maximum number has been reached",
      );

    return this.repo.registerParticipant(competitionEditionId, teamId);
  }

  async replaceCompetitionParticipants(
    competitionEditionId: number,
    teamIds: number[],
  ) {
    await this.findCompetitionEditionById(competitionEditionId);

    await Promise.all(
      teamIds.map((teamId) => this.teamsService.findTeamById(teamId)),
    );

    return this.repo.replaceCompetitionParticipants(
      competitionEditionId,
      teamIds,
    );
  }

  async deleteCompetitionParticipant(
    competitionEditionId: number,
    teamId: number,
  ) {
    await this.validateData(competitionEditionId, teamId);

    return this.repo.deleteCompetitionParticipant(competitionEditionId, teamId);
  }

  async findCompetitionParticipant(
    competitionEditionId: number,
    teamId: number,
  ) {
    await this.validateData(competitionEditionId, teamId);

    return this.repo.findCompetitionParticipant(competitionEditionId, teamId);
  }
}
