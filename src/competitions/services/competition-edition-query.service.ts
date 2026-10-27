import { Injectable } from '@nestjs/common';
import { TeamsService } from '../../teams/teams.service.ts';
import { CompetitionsRepository } from '../competitions.repository.ts';
import { CompetitionEditionNotFoundException } from '../exceptions/edition-not-found.exception.ts';
import { ParticipantNotFoundException } from '../exceptions/participant-not-found.exception.ts';

@Injectable()
export class CompetitionEditionQueryService {
  constructor(
    private readonly repo: CompetitionsRepository,
    private readonly teamsService: TeamsService,
  ) {}

  async findCompetitionEditionById(editionId: number) {
    const edition = await this.repo.findEditionById(editionId);

    if (!edition) {
      throw new CompetitionEditionNotFoundException();
    }

    return edition;
  }

  async findCompetitionParticipant(
    competitionEditionId: number,
    teamId: number,
    message?: string,
  ) {
    await this.findCompetitionEditionById(competitionEditionId);
    await this.teamsService.findTeamById(teamId);

    const participant = await this.repo.findCompetitionParticipant(
      competitionEditionId,
      teamId,
    );

    if (!participant) {
      throw new ParticipantNotFoundException(message);
    }

    return participant;
  }
}
