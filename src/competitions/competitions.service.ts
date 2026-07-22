import { ConflictException, Injectable } from '@nestjs/common';
import { CompetitionType } from '@prisma/client';
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

  async findEditionsByCompetition(competitionId: number) {
    await this.findCompetitionById(competitionId);

    return this.repo.findEditionsByCompetition(competitionId);
  }

  async findCompetitionEditionById(competitionId: number, editionId: number) {
    await this.findCompetitionById(competitionId);

    const edition = await this.repo.findEdition(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    return this.repo.findCompetitionEditionById(competitionId, editionId);
  }

  async createEdition(
    competitionId: number,
    data: CreateCompetitionEditionDto,
  ) {
    const edition = await this.repo.findEditionByCompetitionAndSeason(
      competitionId,
      data.seasonId,
    );

    if (edition)
      throw new ConflictException(
        'This competition already has an edition for this season.',
      );

    return this.repo.createEdition(competitionId, data);
  }

  async assignWinnerTeam(editionId: number, data: UpdateCompetitionEditionDto) {
    await this.teamsService.findTeamById(data.winnerTeamId);

    const edition = await this.repo.findEdition(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    return this.repo.assignWinnerTeam(editionId, data);
  }
}
