import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { UpdateKnockoutRoundDto } from './dto/update-knockout-round.dto.ts';
import { KnockoutRoundNotFoundException } from './exceptions/knockout-round-not-found.exception.ts';
import { KnockoutRoundRepository } from './knockout-round.repository.ts';

@Injectable()
export class KnockoutRoundService {
  constructor(
    private repo: KnockoutRoundRepository,
    private competitionsService: CompetitionsService,
  ) {}

  async findKnockoutRoundById(knockoutRoundId: number) {
    const knockoutRound =
      await this.repo.findKnockoutRoundById(knockoutRoundId);

    if (!knockoutRound) throw new KnockoutRoundNotFoundException();

    return knockoutRound;
  }

  async findKnockoutRoundByCompetitionEditionId(
    competitionEditionId: number,
    type: MatchType,
  ) {
    await this.competitionsService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.findKnockoutRoundByCompetitionEditionId(
      competitionEditionId,
      type,
    );
  }

  async completeKnockoutRound(
    knockoutRoundId: number,
    data: UpdateKnockoutRoundDto,
  ) {
    await this.findKnockoutRoundById(knockoutRoundId);

    return this.repo.completeKnockoutRound(knockoutRoundId, data);
  }

  async createKnockoutRound(
    data: CreateKnockoutRoundDto,
    qualifiedTeamIds: number[],
  ) {
    switch (data.type) {
      case MatchType.ROUND_OF_32:
        if (qualifiedTeamIds.length !== 32)
          throw new BadRequestException(
            "They can't be more or less than 32 qualified teams for a round of 32.",
          );
        break;
      case MatchType.ROUND_OF_16:
        if (qualifiedTeamIds.length !== 16)
          throw new BadRequestException(
            "They can't be more or less than 16 qualified teams for a round of 16.",
          );
        break;
      case MatchType.QUARTER_FINAL:
        if (qualifiedTeamIds.length !== 8)
          throw new BadRequestException(
            "They can't be more or less than 8 qualified teams for the quarterfinals.",
          );
        break;
      case MatchType.SEMI_FINAL:
        if (qualifiedTeamIds.length !== 4)
          throw new BadRequestException(
            "They can't be more or less than 4 qualified teams for the semifinals.",
          );
        break;
      case MatchType.THIRD_PLACE:
      case MatchType.FINAL:
        if (qualifiedTeamIds.length !== 2)
          throw new BadRequestException(
            "They can't be more or less than 2 qualified teams for the third place match or the final.",
          );
        break;
      default:
        break;
    }

    return this.repo.createKnockoutRound(data, qualifiedTeamIds);
  }
}
