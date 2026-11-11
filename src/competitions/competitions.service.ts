import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CreateCompetitionEditionDto } from './dto/create-competition-edition.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';
import { CompetitionNotFoundException } from './exceptions/competition-not-found.exception.ts';
import { CompetitionEditionNotFoundException } from './exceptions/edition-not-found.exception.ts';
import { ParticipantNotFoundException } from './exceptions/participant-not-found.exception.ts';

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

  findCompetitionsByFormat(format: CompetitionFormat) {
    return this.repo.findByFormat(format);
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
    const competition = await this.findCompetitionById(competitionId);
    await this.seasonService.findSeasonById(data.seasonId);

    const edition = await this.repo.findEditionByCompetitionAndSeason(
      competitionId,
      data.seasonId,
    );

    if (edition)
      throw new BadRequestException(
        'This competition already has an edition for this season.',
      );

    if (competition.format !== CompetitionFormat.LEAGUE && !data.finalStadiumId)
      throw new BadRequestException(
        "If the competition doesn't have a league format, then you have to assign a stadium for the final.",
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

    const participants =
      await this.repo.findCompetitionParticipants(competitionEditionId);

    return participants.map((participant) => ({
      team: participant.team,
      position: participant.position,
    }));
  }

  async countCompetitionParticipants(competitionEditionId: number) {
    await this.findCompetitionEditionById(competitionEditionId);

    return this.repo.countCompetitionParticipants(competitionEditionId);
  }

  async registerParticipant(competitionEditionId: number, teamIds: number[]) {
    await Promise.all(
      teamIds.map((teamId) => this.teamsService.findTeamById(teamId)),
    );
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (!edition) throw new CompetitionEditionNotFoundException();

    const participants = await Promise.all(
      teamIds.map((teamId) =>
        this.repo.findCompetitionParticipant(competitionEditionId, teamId),
      ),
    );

    if (participants.some((participant) => participant)) {
      throw new ConflictException('This team has already been registered');
    }

    const registeredTeams =
      await this.countCompetitionParticipants(competitionEditionId);

    if (registeredTeams >= edition.competition.maxTeamsNumber)
      throw new BadRequestException(
        "You can't register more teams, the maximum number has been reached",
      );

    return this.repo.registerParticipant(competitionEditionId, teamIds);
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
    message?: string,
  ) {
    await this.validateData(competitionEditionId, teamId);

    const participant = await this.repo.findCompetitionParticipant(
      competitionEditionId,
      teamId,
    );

    if (!participant) throw new ParticipantNotFoundException(message);

    return participant;
  }

  async findCompetitionEditionMatches(competitionEditionId: number) {
    await this.findCompetitionEditionById(competitionEditionId);

    return this.repo.findCompetitionMatches(competitionEditionId);
  }

  async findCompetitionGroups(
    competitionId: number,
    competitionEditionId: number,
  ) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (edition.competitionId !== competitionId) {
      throw new BadRequestException(
        'The competition edition does not belong to this competition.',
      );
    }

    if (edition.competition.format !== CompetitionFormat.GROUPS_AND_KNOCKOUT) {
      throw new BadRequestException(
        'Groups are only available for GROUPS_AND_KNOCKOUT competitions.',
      );
    }

    const participants =
      await this.repo.findCompetitionGroupParticipants(competitionEditionId);
    const groups: Record<string, typeof participants> = {};

    for (const participant of participants) {
      if (participant.group === null) continue;

      (groups[participant.group] ??= []).push(participant);
    }

    return groups;
  }
}
