import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ClubsService } from '../../clubs/clubs.service.ts';
import { CompetitionsRepository } from '../competitions.repository.ts';
import { UpdateCompetitionEditionDto } from '../dto/update-competition-edition.dto.ts';
import { CompetitionNotFoundException } from '../exceptions/competition-not-found.exception.ts';
import { CompetitionEditionNotFoundException } from '../exceptions/edition-not-found.exception.ts';
import { ParticipantNotFoundException } from '../exceptions/participant-not-found.exception.ts';

@Injectable()
export class CompetitionEditionQueryService {
  constructor(
    private readonly repo: CompetitionsRepository,
    private readonly clubsService: ClubsService,
  ) {}

  async findCompetitionById(id: number) {
    const competition = await this.repo.findById(id);

    if (!competition) throw new CompetitionNotFoundException();

    return competition;
  }

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
    await this.clubsService.findClubById(teamId);

    const participant = await this.repo.findCompetitionParticipant(
      competitionEditionId,
      teamId,
    );

    if (!participant) {
      throw new ParticipantNotFoundException(message);
    }

    return participant;
  }

  async assignWinnerAndRunnerUp(
    competitionId: number,
    editionId: number,
    data: UpdateCompetitionEditionDto,
  ) {
    await this.findCompetitionById(competitionId);

    await this.clubsService.findClubById(data.winnerClubId);

    await this.clubsService.findClubById(data.runnerUpClubId);

    if (data.winnerClubId === data.runnerUpClubId)
      throw new ConflictException(
        'The winner and the runner-up teams must be different',
      );

    const edition = await this.repo.findEditionById(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    const winnerClub = await this.repo.findCompetitionParticipant(
      editionId,
      data.winnerClubId,
    );

    const runnerUpClub = await this.repo.findCompetitionParticipant(
      editionId,
      data.runnerUpClubId,
    );

    if (!winnerClub || !runnerUpClub)
      throw new BadRequestException(
        "You can't assign a team that is not participating in the given competition",
      );

    return this.repo.assignWinnerAndRunnerUp(editionId, data);
  }
}
