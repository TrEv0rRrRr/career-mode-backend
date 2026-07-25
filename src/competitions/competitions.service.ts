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

  async findCompetitionEditionById(competitionId: number, editionId: number) {
    await this.findCompetitionById(competitionId);

    const edition = await this.repo.findCompetitionEditionById(
      competitionId,
      editionId,
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

    const edition = await this.repo.findCompetitionEditionById(
      competitionId,
      editionId,
    );

    if (!edition) throw new CompetitionEditionNotFoundException();

    return this.repo.assignWinnerAndRunnerUp(editionId, data);
  }

  // ! Team Season Methods

  async validateData(competitionId: number, seasonId: number, teamId: number) {
    await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(seasonId);
    await this.teamsService.findTeamById(teamId);
  }

  async findCompetitionTeams(competitionId: number, seasonId: number) {
    await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(seasonId);

    return this.repo.findCompetitionTeams(competitionId, seasonId);
  }

  async assignTeam(competitionId: number, seasonId: number, teamId: number) {
    await this.validateData(competitionId, seasonId, teamId);

    return this.repo.assignTeam(competitionId, seasonId, teamId);
  }

  async replaceCompetitionTeams(
    competitionId: number,
    seasonId: number,
    teamIds: number[],
  ) {
    await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(seasonId);

    await Promise.all(
      teamIds.map((teamId) => this.teamsService.findTeamById(teamId)),
    );

    return this.repo.replaceCompetitionTeams(competitionId, seasonId, teamIds);
  }

  async deleteTeam(competitionId: number, seasonId: number, teamId: number) {
    await this.validateData(competitionId, seasonId, teamId);

    return this.repo.removeTeam(competitionId, seasonId, teamId);
  }

  async findTeamSeason(
    competitionId: number,
    seasonId: number,
    teamId: number,
  ) {
    await this.validateData(competitionId, seasonId, teamId);

    return this.repo.findTeamSeason(competitionId, seasonId, teamId);
  }
}
