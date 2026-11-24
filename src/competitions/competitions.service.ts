import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { ClubsService } from '../clubs/clubs.service.ts';
import { MatchMapper } from '../matches/dto/mapper/match.mapper.ts';
import { NationalTeamsService } from '../national-teams/national-teams.service.ts';
import { SeasonsService } from '../seasons/seasons.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { CompetitionsRepository } from './competitions.repository.ts';
import { ChangeEditionFinalStadiumDto } from './dto/change-edition-final-stadium.dto.ts';
import { CreateManyEditionsDto } from './dto/create-many-editions.dto.ts';
import { CompetitionMapper } from './dto/mapper/competition.mapper.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';
import { CompetitionNotFoundException } from './exceptions/competition-not-found.exception.ts';
import { CompetitionEditionNotFoundException } from './exceptions/edition-not-found.exception.ts';
import { ParticipantNotFoundException } from './exceptions/participant-not-found.exception.ts';

@Injectable()
export class CompetitionsService {
  constructor(
    private repo: CompetitionsRepository,
    private clubsService: ClubsService,
    private seasonService: SeasonsService,
    private nationalTeamsService: NationalTeamsService,
    private stadiumsService: StadiumsService,
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

  async createEditionsForTheCurrentSeason(data: CreateManyEditionsDto[]) {
    const season = await this.seasonService.findCurrentSeason();

    const competitionIds = data.map((d) => d.competitionId);

    if (new Set(competitionIds).size !== competitionIds.length)
      throw new ConflictException(
        'A competition cannot have more than one edition in the request',
      );

    await Promise.all(
      data.map(async (d) => {
        const competition = await this.findCompetitionById(d.competitionId);

        if (competition.format !== CompetitionFormat.LEAGUE) {
          if (!d.finalStadiumId)
            throw new BadRequestException(
              "If the competition doesn't have a league format, then you have to assign a stadium for the final.",
            );

          await this.stadiumsService.findStadiumById(d.finalStadiumId);
        }
      }),
    );

    const existingEditions = await Promise.all(
      data.map((d) =>
        this.repo.findEditionByCompetitionAndSeason(d.competitionId, season.id),
      ),
    );

    if (existingEditions.some((edition) => edition !== null))
      throw new ConflictException(
        "There's a competition with an edition already created for the current season",
      );

    return this.repo.createEditionsForTheCurrentSeason(season.id, data);
  }

  async changeEditionFinalStadium(
    editionId: number,
    data: ChangeEditionFinalStadiumDto,
  ) {
    await this.repo.findEditionById(editionId);
    await this.stadiumsService.findStadiumById(data.finalStadiumId);

    const currentEditions = await this.findEditionsOfTheCurrentSeason();

    const isTheStadiumInUse = currentEditions.some(
      (e) => e.id !== editionId && e.finalStadium.id === data.finalStadiumId,
    );

    if (isTheStadiumInUse)
      throw new ConflictException(
        'This stadium is already set for another competition edition',
      );

    return this.repo.changeEditionFinalStadium(editionId, data);
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

    const isNationalTeamsCompetition =
      competition.type === CompetitionType.NATIONAL_TEAMS;

    if (isNationalTeamsCompetition) {
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
      });
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
        'The winner and the runner-up clubs must be different',
      );

    const [winner, runnerUp] = await Promise.all([
      this.repo.findCompetitionParticipant(editionId, winnerClubId),
      this.repo.findCompetitionParticipant(editionId, runnerUpClubId),
    ]);

    if (!winner || !runnerUp)
      throw new BadRequestException(
        "You can't assign a club that is not participating in the given competition",
      );

    return this.repo.assignWinnerAndRunnerUp(editionId, {
      winnerClubId,
      runnerUpClubId,
      winnerNationalTeamId: null,
      runnerUpNationalTeamId: null,
    });
  }

  // ! Competition Participant Methods

  async validateData(competitionEditionId: number, clubId: number) {
    await this.findCompetitionEditionById(competitionEditionId);
    await this.clubsService.findClubById(clubId);
  }

  async findCompetitionParticipants(competitionEditionId: number) {
    await this.findCompetitionEditionById(competitionEditionId);

    const participants =
      await this.repo.findCompetitionParticipants(competitionEditionId);

    return participants.map((participant) => ({
      club: participant.club,
      position: participant.position,
    }));
  }

  async findNationalTeamCompetitionParticipants(competitionEditionId: number) {
    await this.findCompetitionEditionById(competitionEditionId);

    return this.repo.findNationalTeamCompetitionParticipants(
      competitionEditionId,
    );
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
      club: participant.club,
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
        participantIds.map((id) => this.clubsService.findClubById(id)),
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
      participantIds.map((id) => this.clubsService.findClubById(id)),
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

    await this.clubsService.findClubById(participantId);
    return this.repo.deleteCompetitionParticipant(
      competitionEditionId,
      participantId,
    );
  }

  async findCompetitionParticipant(
    competitionEditionId: number,
    clubId: number,
    message?: string,
  ) {
    await this.validateData(competitionEditionId, clubId);

    const participant = await this.repo.findCompetitionParticipant(
      competitionEditionId,
      clubId,
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
      CompetitionMapper.mapParticipantClubs(pt),
    );

    const groups: Record<string, typeof pt> = {};

    for (const participant of pt) {
      if (participant.group === null) continue;

      (groups[participant.group] ??= []).push(participant);
    }

    return groups;
  }
}
