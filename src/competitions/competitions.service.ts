import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { MatchMapper } from '../matches/dto/mapper/match.mapper.ts';
import { NationalTeamsService } from '../national-teams/national-teams.service.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CreateCompetitionEditionDto } from './dto/create-competition-edition.dto.ts';
import { CompetitionMapper } from './dto/mapper/competition.mapper.ts';
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
    private nationalTeamsService: NationalTeamsService,
  ) {}

  async findCompetitionById(id: number) {
    const competition = await this.repo.findById(id);

    if (!competition) throw new CompetitionNotFoundException();

    return competition;
  }

  async findCompetitions() {
    const competition = await this.repo.findAll();

    return competition.map((c) => CompetitionMapper.toResponse(c));
  }

  async findCompetitionsByType(type: CompetitionType) {
    const competition = await this.repo.findByType(type);

    return competition.map((c) => CompetitionMapper.toResponse(c));
  }

  async findCompetitionsByFormat(format: CompetitionFormat) {
    const competition = await this.repo.findByFormat(format);

    return competition.map((c) => CompetitionMapper.toResponse(c));
  }

  // ! Competition Edition methods
  async findEditionsByCompetition(competitionId: number) {
    await this.findCompetitionById(competitionId);

    const cES = await this.repo.findEditionsByCompetition(competitionId);

    return cES.map((cEs) => CompetitionMapper.editionsToResponse(cEs));
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

  async findEditionsOfTheCurrentSeason() {
    const season = await this.seasonService.findCurrentSeason();

    const editions = await this.repo.findEditionsOfTheCurrentSeason(season.id);

    return editions.map((e) => CompetitionMapper.editionsToResponse(e));
  }

  async findEditionsBySeason(seasonId: number) {
    await this.seasonService.findSeasonById(seasonId);

    const editions = await this.repo.findEditionsBySeason(seasonId);

    return editions.map((e) => CompetitionMapper.editionsToResponse(e));
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

  async findAllCompetitionParticipants(competitionEditionId: number) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (edition.competition.type === CompetitionType.NATIONAL_TEAMS) {
      const participants =
        await this.repo.findNationalTeamCompetitionParticipants(
          competitionEditionId,
        );

      return participants.map((participant) => ({
        nationalTeam: participant.nationalTeam,
        position: participant.position,
      }));
    }

    const participants =
      await this.repo.findCompetitionParticipants(competitionEditionId);

    return participants.map((participant) => ({
      team: participant.team,
      position: participant.position,
    }));
  }

  async findLeagueStandings(competitionEditionId: number) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (edition.competition.format !== CompetitionFormat.LEAGUE) {
      throw new BadRequestException(
        'Standings are only available for league competitions.',
      );
    }

    const leagueStandings =
      await this.repo.findLeagueStandings(competitionEditionId);

    return leagueStandings.map((lS) =>
      CompetitionMapper.mapLeagueStandings(lS),
    );
  }

  async countCompetitionParticipants(competitionEditionId: number) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    return edition.competition.type === CompetitionType.NATIONAL_TEAMS
      ? this.repo.countNationalTeamCompetitionParticipants(competitionEditionId)
      : this.repo.countCompetitionParticipants(competitionEditionId);
  }

  async registerParticipant(
    competitionEditionId: number,
    participantIds: number[],
  ) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);
    const isNationalTeamsCompetition =
      edition.competition.type === CompetitionType.NATIONAL_TEAMS;

    if (new Set(participantIds).size !== participantIds.length) {
      throw new ConflictException(
        'A participant cannot be registered more than once',
      );
    }

    if (isNationalTeamsCompetition) {
      await Promise.all(
        participantIds.map((id) =>
          this.nationalTeamsService.findNationalTeamById(id),
        ),
      );
    } else {
      await Promise.all(
        participantIds.map((id) => this.teamsService.findTeamById(id)),
      );
    }

    const participants = await Promise.all(
      participantIds.map((id) =>
        isNationalTeamsCompetition
          ? this.repo.findNationalTeamCompetitionParticipant(
              competitionEditionId,
              id,
            )
          : this.repo.findCompetitionParticipant(competitionEditionId, id),
      ),
    );

    if (participants.some((participant) => participant)) {
      throw new ConflictException(
        'This participant has already been registered',
      );
    }

    const registeredParticipants =
      await this.countCompetitionParticipants(competitionEditionId);

    if (
      registeredParticipants + participantIds.length >
      edition.competition.maxTeamsNumber
    )
      throw new BadRequestException(
        "You can't register more participants, the maximum number has been reached",
      );

    return isNationalTeamsCompetition
      ? this.repo.registerNationalTeamParticipants(
          competitionEditionId,
          participantIds,
        )
      : this.repo.registerParticipant(competitionEditionId, participantIds);
  }

  async replaceCompetitionParticipants(
    competitionEditionId: number,
    participantIds: number[],
  ) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);
    const isNationalTeamsCompetition =
      edition.competition.type === CompetitionType.NATIONAL_TEAMS;

    if (participantIds.length > edition.competition.maxTeamsNumber) {
      throw new BadRequestException(
        "You can't register more participants, the maximum number has been reached",
      );
    }

    if (new Set(participantIds).size !== participantIds.length) {
      throw new ConflictException(
        'A participant cannot be registered more than once',
      );
    }

    if (isNationalTeamsCompetition) {
      await Promise.all(
        participantIds.map((id) =>
          this.nationalTeamsService.findNationalTeamById(id),
        ),
      );
      return this.repo.replaceNationalTeamCompetitionParticipants(
        competitionEditionId,
        participantIds,
      );
    }

    await Promise.all(
      participantIds.map((id) => this.teamsService.findTeamById(id)),
    );

    return this.repo.replaceCompetitionParticipants(
      competitionEditionId,
      participantIds,
    );
  }

  async deleteCompetitionParticipant(
    competitionEditionId: number,
    participantId: number,
  ) {
    const edition = await this.findCompetitionEditionById(competitionEditionId);

    if (edition.competition.type === CompetitionType.NATIONAL_TEAMS) {
      await this.nationalTeamsService.findNationalTeamById(participantId);
      return this.repo.deleteNationalTeamCompetitionParticipant(
        competitionEditionId,
        participantId,
      );
    }

    await this.teamsService.findTeamById(participantId);
    return this.repo.deleteCompetitionParticipant(
      competitionEditionId,
      participantId,
    );
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

    const cEM = await this.repo.findCompetitionMatches(competitionEditionId);

    return cEM.map((match) => MatchMapper.toResponse(match));
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

    const pt = participants.map((pt) =>
      CompetitionMapper.mapParticipantTeams(pt),
    );

    const groups: Record<string, typeof pt> = {};

    for (const participant of pt) {
      if (participant.group === null) continue;

      (groups[participant.group] ??= []).push(participant);
    }

    return groups;
  }
}
