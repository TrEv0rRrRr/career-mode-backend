import { Injectable } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';
import { MatchNotFoundException } from './exceptions/match-not-found.exception.ts';
import { MatchesRepository } from './matches.repository.ts';

@Injectable()
export class MatchesService {
  constructor(
    private repo: MatchesRepository,
    private teamsService: TeamsService,
    private stadiumsService: StadiumsService,
    private competitionsService: CompetitionsService,
  ) {}

  async findMatch(matchId: number) {
    const match = await this.repo.findOne(matchId);

    if (!match) throw new MatchNotFoundException();

    return match;
  }

  async createMatch(competitionId: number, data: CreateMatchDto) {
    await this.teamsService.findTeamById(data.homeTeamId);
    await this.teamsService.findTeamById(data.awayTeamId);
    await this.stadiumsService.findStadiumById(data.stadiumId);
    await this.competitionsService.findCompetitionEditionById(
      competitionId,
      data.competitionEditionId,
    );
    // TODO: Hacer que el backend infiera el tipo de partido dependiendo de la competición
    const type = MatchType.FINAL;

    return this.repo.create(type, data);
  }

  async updateMatch(matchId: number, data: UpdateMatchDto) {
    await this.findMatch(matchId);
    return this.repo.update(matchId, data);
  }
}
