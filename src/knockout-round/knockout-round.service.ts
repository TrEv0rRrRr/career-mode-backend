import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { validateArrayEquality } from '../common/helpers/validateArrayEquality.ts';
import { NextKnockoutRoundData } from '../common/types/NextKnockoutRoundData.ts';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { CompetitionFixtureService } from '../competitions/services/competition-fixture.service.ts';
import { CreateKnockoutRoundPairingsDto } from './dto/create-knockout-pairing.dto.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { KnockoutRoundType } from './enums/KnockoutRoundType.ts';
import { KnockoutRoundNotFoundException } from './exceptions/knockout-round-not-found.exception.ts';
import {
  KnockoutRoundRepository,
  KnockoutRoundWithRelations,
} from './knockout-round.repository.ts';

@Injectable()
export class KnockoutRoundService {
  constructor(
    private repo: KnockoutRoundRepository,
    private competitionsService: CompetitionsService,
    private moduleRef: ModuleRef,
  ) {}

  async findKnockoutRoundById(
    knockoutRoundId: number,
  ): Promise<KnockoutRoundWithRelations> {
    const knockoutRound =
      await this.repo.findKnockoutRoundById(knockoutRoundId);

    if (!knockoutRound) throw new KnockoutRoundNotFoundException();

    return knockoutRound;
  }

  async findKnockoutRoundByTypeAndCompetitionEditionId(
    competitionEditionId: number,
    type: KnockoutRoundType,
  ) {
    await this.competitionsService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.findKnockoutRoundByTypeAndCompetitionEditionId(
      competitionEditionId,
      type,
    );
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

    const participantTeams = await this.competitionsService
      .findCompetitionParticipants(edition.id)
      .then((data) => data.map(({ team }) => team.id));

    const qualifiedTeamsWithoutDuplicates = [...new Set(data.qualifiedTeams)];

    const areQualifiedTeamsParticipatingInTheCompetition =
      validateArrayEquality(participantTeams, qualifiedTeamsWithoutDuplicates);

    if (!areQualifiedTeamsParticipatingInTheCompetition)
      throw new ConflictException(
        'There is a team that is not participating in this competition edition',
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
        if (qualifiedTeamsWithoutDuplicates.length !== 32)
          throw new BadRequestException(
            "They can't be more or less than 32 qualified teams for a round of 32.",
          );
        break;
      case KnockoutRoundType.ROUND_OF_16:
        if (qualifiedTeamsWithoutDuplicates.length !== 16)
          throw new BadRequestException(
            "They can't be more or less than 16 qualified teams for a round of 16.",
          );
        break;
      case KnockoutRoundType.QUARTER_FINAL:
        if (qualifiedTeamsWithoutDuplicates.length !== 8)
          throw new BadRequestException(
            "They can't be more or less than 8 qualified teams for the quarterfinals.",
          );
        break;
      case KnockoutRoundType.SEMI_FINAL:
        if (qualifiedTeamsWithoutDuplicates.length !== 4)
          throw new BadRequestException(
            "They can't be more or less than 4 qualified teams for the semifinals.",
          );
        break;
      case KnockoutRoundType.THIRD_PLACE:
      case KnockoutRoundType.FINAL:
        if (qualifiedTeamsWithoutDuplicates.length !== 2)
          throw new BadRequestException(
            "They can't be more or less than 2 qualified teams for the third place match or the final.",
          );
        break;
      default:
        break;
    }

    const finalData: CreateKnockoutRoundDto = {
      ...data,
      qualifiedTeams: qualifiedTeamsWithoutDuplicates,
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

    const teamIds: Set<number> = new Set([]);

    for (const pairing of data.pairings) {
      if (pairing.homeTeamId === pairing.awayTeamId)
        throw new ConflictException("There's a pairing with two equal teams");
      teamIds.add(pairing.homeTeamId);
      teamIds.add(pairing.awayTeamId);
    }

    const totalTeamAppearances = data.pairings.length * 2;

    if (teamIds.size !== totalTeamAppearances) {
      throw new ConflictException(
        'A team cannot participate in multiple pairings',
      );
    }

    const qualifiedTeams = knockoutRound.qualifiedTeams.map(
      ({ teamId }) => teamId,
    );

    const areArraysEqual = validateArrayEquality([...teamIds], qualifiedTeams);

    if (!areArraysEqual)
      throw new ConflictException(
        "There are teams that aren't qualified for the next round",
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
  ) {
    await this.findKnockoutRoundById(knockoutRoundId);

    return this.repo.resolveRoundAndCreateNextRounds(
      knockoutRoundId,
      nextRounds,
    );
  }
}
