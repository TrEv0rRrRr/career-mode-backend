import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CompetitionType } from '@prisma/client';
import { validateArrayEquality } from '../common/helpers/validateArrayEquality.ts';
import { NextKnockoutRoundData } from '../common/types/NextKnockoutRoundData.ts';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { CompetitionFixtureService } from '../competitions/services/competition-fixture.service.ts';
import { CreateKnockoutRoundPairingsDto } from './dto/create-knockout-pairing.dto.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { KnockoutRoundMapper } from './dto/mapper/knockout-round.mapper.ts';
import { KnockoutRoundResponseDto } from './dto/response/knockout-round-response.dto.ts';
import { KnockoutRoundType } from './enums/KnockoutRoundType.ts';
import { KnockoutRoundNotFoundException } from './exceptions/knockout-round-not-found.exception.ts';
import { KnockoutRoundRepository } from './knockout-round.repository.ts';

@Injectable()
export class KnockoutRoundService {
  constructor(
    private repo: KnockoutRoundRepository,
    private competitionsService: CompetitionsService,
    private moduleRef: ModuleRef,
  ) {}

  async findKnockoutRoundById(
    knockoutRoundId: number,
  ): Promise<KnockoutRoundResponseDto> {
    const knockoutRound =
      await this.repo.findKnockoutRoundById(knockoutRoundId);

    if (!knockoutRound) throw new KnockoutRoundNotFoundException();

    return KnockoutRoundMapper.toResponse(knockoutRound);
  }

  async findKnockoutRoundByTypeAndCompetitionEditionId(
    competitionEditionId: number,
    type: KnockoutRoundType,
  ) {
    await this.competitionsService.findCompetitionEditionById(
      competitionEditionId,
    );

    const kR = await this.repo.findKnockoutRoundByTypeAndCompetitionEditionId(
      competitionEditionId,
      type,
    );

    if (!kR) throw new KnockoutRoundNotFoundException();

    return KnockoutRoundMapper.toResponse(kR);
  }

  async completeKnockoutRound(knockoutRoundId: number) {
    await this.findKnockoutRoundById(knockoutRoundId);

    return this.repo.completeKnockoutRound(knockoutRoundId);
  }

  async createKnockoutRound(
    data: CreateKnockoutRoundDto,
    type: KnockoutRoundType,
  ) {
    const edition = await this.competitionsService.findCompetitionEditionById(
      data.competitionEditionId,
    );

    const isNationalTeamsCompetition =
      edition.competition.type === CompetitionType.NATIONAL_TEAMS;
    const qualifiedParticipants = isNationalTeamsCompetition
      ? data.qualifiedNationalTeams
      : data.qualifiedClubs;
    const otherParticipantType = isNationalTeamsCompetition
      ? data.qualifiedClubs
      : data.qualifiedNationalTeams;

    if (!qualifiedParticipants?.length || otherParticipantType !== undefined)
      throw new BadRequestException(
        `Provide a non-empty ${
          isNationalTeamsCompetition
            ? 'qualifiedNationalTeams'
            : 'qualifiedClubs'
        } array matching the competition type.`,
      );

    const qualifiedParticipantsWithoutDuplicates = [
      ...new Set(qualifiedParticipants),
    ];
    const participants = isNationalTeamsCompetition
      ? await this.competitionsService
          .findNationalTeamCompetitionParticipants(edition.id)
          .then((items) => items.map(({ nationalTeamId }) => nationalTeamId))
      : await this.competitionsService
          .findCompetitionParticipants(edition.id)
          .then((items) => items.map(({ club }) => club.id));

    if (
      !validateArrayEquality(
        participants,
        qualifiedParticipantsWithoutDuplicates,
      )
    )
      throw new ConflictException(
        `There is a ${
          isNationalTeamsCompetition ? 'national team' : 'club'
        } that is not participating in this competition edition`,
      );

    const thereIsUncompleted =
      await this.repo.findNonCompletedKnockoutRoundByCompetitionEditionId(
        data.competitionEditionId,
      );

    if (thereIsUncompleted)
      throw new ConflictException(
        "You can't register a new knockout round for this edition because there's one being played yet.",
      );

    switch (type) {
      case KnockoutRoundType.ROUND_OF_32:
        if (qualifiedParticipantsWithoutDuplicates.length !== 32)
          throw new BadRequestException(
            "They can't be more or less than 32 qualified participants for a round of 32.",
          );
        break;
      case KnockoutRoundType.ROUND_OF_16:
        if (qualifiedParticipantsWithoutDuplicates.length !== 16)
          throw new BadRequestException(
            "They can't be more or less than 16 qualified participants for a round of 16.",
          );
        break;
      case KnockoutRoundType.QUARTER_FINAL:
        if (qualifiedParticipantsWithoutDuplicates.length !== 8)
          throw new BadRequestException(
            "They can't be more or less than 8 qualified participants for the quarterfinals.",
          );
        break;
      case KnockoutRoundType.SEMI_FINAL:
        if (qualifiedParticipantsWithoutDuplicates.length !== 4)
          throw new BadRequestException(
            "They can't be more or less than 4 qualified participants for the semifinals.",
          );
        break;
      case KnockoutRoundType.THIRD_PLACE:
      case KnockoutRoundType.FINAL:
        if (qualifiedParticipantsWithoutDuplicates.length !== 2)
          throw new BadRequestException(
            "They can't be more or less than 2 qualified participants for the third place match or the final.",
          );
        break;
      default:
        break;
    }

    const finalData: CreateKnockoutRoundDto = isNationalTeamsCompetition
      ? {
          competitionEditionId: data.competitionEditionId,
          qualifiedNationalTeams: qualifiedParticipantsWithoutDuplicates,
        }
      : {
          competitionEditionId: data.competitionEditionId,
          qualifiedClubs: qualifiedParticipantsWithoutDuplicates,
        };

    return this.repo.createKnockoutRound(finalData, type);
  }

  async generateKnockoutRoundMatches(
    knockoutRoundId: number,
    data: CreateKnockoutRoundPairingsDto,
  ) {
    const knockoutRound = await this.findKnockoutRoundById(knockoutRoundId);

    if (knockoutRound.completed)
      throw new BadRequestException(
        'This knockout round is completed, try creating a new one',
      );

    const edition = await this.competitionsService.findCompetitionEditionById(
      knockoutRound.competitionEditionId,
    );
    const isNationalTeamsCompetition =
      edition.competition.type === CompetitionType.NATIONAL_TEAMS;
    const participantIds = new Set<number>();

    for (const pairing of data.pairings) {
      const homeId = isNationalTeamsCompetition
        ? pairing.homeNationalTeamId
        : pairing.homeClubId;
      const awayId = isNationalTeamsCompetition
        ? pairing.awayNationalTeamId
        : pairing.awayClubId;
      const otherHomeId = isNationalTeamsCompetition
        ? pairing.homeClubId
        : pairing.homeNationalTeamId;
      const otherAwayId = isNationalTeamsCompetition
        ? pairing.awayClubId
        : pairing.awayNationalTeamId;

      if (
        typeof homeId !== 'number' ||
        !Number.isInteger(homeId) ||
        homeId < 1 ||
        typeof awayId !== 'number' ||
        !Number.isInteger(awayId) ||
        awayId < 1 ||
        otherHomeId !== undefined ||
        otherAwayId !== undefined
      )
        throw new BadRequestException(
          `Each pairing must contain ${
            isNationalTeamsCompetition
              ? 'homeNationalTeamId and awayNationalTeamId'
              : 'homeClubId and awayClubId'
          } only.`,
        );
      if (homeId === awayId)
        throw new ConflictException(
          'A pairing cannot contain the same participant twice.',
        );
      participantIds.add(homeId);
      participantIds.add(awayId);
    }

    const totalParticipantAppearances = data.pairings.length * 2;

    if (participantIds.size !== totalParticipantAppearances) {
      throw new ConflictException(
        'A participant cannot participate in multiple pairings',
      );
    }

    const qualifiedParticipants = isNationalTeamsCompetition
      ? knockoutRound.qualifiedNationalTeams.map(({ id }) => id)
      : knockoutRound.qualifiedClubs.map(({ id }) => id);

    const areArraysEqual = validateArrayEquality(
      [...participantIds],
      qualifiedParticipants,
    );

    if (!areArraysEqual)
      throw new ConflictException(
        "There are participants that aren't qualified for this round",
      );

    const existingTies =
      await this.repo.countKnockoutRoundTies(knockoutRoundId);

    if (existingTies > 0)
      throw new ConflictException(
        'The ties have already been generated for this knockout.',
      );

    // this avoids the cyclical dependency error

    const competitionFixtureService = this.moduleRef.get(
      CompetitionFixtureService,
      { strict: false },
    );

    return competitionFixtureService.generateKnockoutRoundMatches(
      knockoutRound,
      data.pairings,
    );
  }

  async resolveRoundAndCreateNextRounds(
    knockoutRoundId: number,
    nextRounds: NextKnockoutRoundData[],
    eliminatedParticipantIds: number[] = [],
  ) {
    await this.findKnockoutRoundById(knockoutRoundId);

    return this.repo.resolveRoundAndCreateNextRounds(
      knockoutRoundId,
      nextRounds,
      eliminatedParticipantIds,
    );
  }
}
