import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';
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
    const competition = await this.findCompetitionById(competitionId);
    const edition = await this.repo.findEditionById(editionId);

    if (!edition) throw new CompetitionEditionNotFoundException();
    if (edition.competitionId !== competitionId)
      throw new BadRequestException(
        'The competition edition does not belong to this competition.',
      );

    if (competition.type === CompetitionType.NATIONAL_TEAMS) {
      const { winnerNationalTeamId, runnerUpNationalTeamId } = data;
      if (
        typeof winnerNationalTeamId !== 'number' ||
        !Number.isInteger(winnerNationalTeamId) ||
        winnerNationalTeamId < 1 ||
        typeof runnerUpNationalTeamId !== 'number' ||
        !Number.isInteger(runnerUpNationalTeamId) ||
        runnerUpNationalTeamId < 1 ||
        data.winnerClubId !== undefined ||
        data.runnerUpClubId !== undefined
      )
        throw new BadRequestException(
          'Provide the winnerNationalTeamId and runnerUpNationalTeamId for a national teams competition.',
        );
      if (winnerNationalTeamId === runnerUpNationalTeamId)
        throw new ConflictException(
          'The winner and the runner-up national teams must be different',
        );
      const [winner, runnerUp] = await Promise.all([
        this.repo.findNationalTeamCompetitionParticipant(
          editionId,
          winnerNationalTeamId,
        ),
        this.repo.findNationalTeamCompetitionParticipant(
          editionId,
          runnerUpNationalTeamId,
        ),
      ]);
      if (!winner || !runnerUp)
        throw new BadRequestException(
          "You can't assign a national team that is not participating in the given competition",
        );
      return this.repo.assignWinnerAndRunnerUp(editionId, {
        winnerNationalTeamId,
        runnerUpNationalTeamId,
        winnerClubId: null,
        runnerUpClubId: null,
      } satisfies Prisma.CompetitionEditionUncheckedUpdateInput);
    }

    const { winnerClubId, runnerUpClubId } = data;
    if (
      typeof winnerClubId !== 'number' ||
      !Number.isInteger(winnerClubId) ||
      winnerClubId < 1 ||
      typeof runnerUpClubId !== 'number' ||
      !Number.isInteger(runnerUpClubId) ||
      runnerUpClubId < 1 ||
      data.winnerNationalTeamId !== undefined ||
      data.runnerUpNationalTeamId !== undefined
    )
      throw new BadRequestException(
        'Provide the winnerClubId and runnerUpClubId for a club competition.',
      );
    await Promise.all([
      this.clubsService.findClubById(winnerClubId),
      this.clubsService.findClubById(runnerUpClubId),
    ]);
    if (winnerClubId === runnerUpClubId)
      throw new ConflictException(
        'The winner and the runner-up teams must be different',
      );
    const [winner, runnerUp] = await Promise.all([
      this.repo.findCompetitionParticipant(editionId, winnerClubId),
      this.repo.findCompetitionParticipant(editionId, runnerUpClubId),
    ]);
    if (!winner || !runnerUp)
      throw new BadRequestException(
        "You can't assign a team that is not participating in the given competition",
      );
    return this.repo.assignWinnerAndRunnerUp(editionId, {
      winnerClubId,
      runnerUpClubId,
      winnerNationalTeamId: null,
      runnerUpNationalTeamId: null,
    } satisfies Prisma.CompetitionEditionUncheckedUpdateInput);
  }
}
